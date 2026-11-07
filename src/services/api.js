import axios from 'axios';
import { API_BASE_URL } from '@/config/env';
import { tokenStorage } from '@/utils/tokenStorage';
import ApiError from './ApiError';

/**
 * Centralised HTTP client — the only place axios is used.
 *
 * Backend envelope (see README):
 *   success: { success: true,  data, message? }
 *   error:   { success: false, error: { code, message, details? } }
 *
 * `http.*` helpers resolve with the unwrapped `data` and reject with ApiError.
 */
const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { Accept: 'application/json' },
});

let unauthorizedHandler = null;
/** Phase 2 registers a handler here (e.g. clear session and redirect to login). */
export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
}

client.interceptors.request.use((config) => {
  const token = tokenStorage.getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

function normalizeError(error) {
  if (error instanceof ApiError) return error;
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const apiError = error.response.data?.error;
      return new ApiError(apiError?.message ?? 'The request could not be completed.', {
        code: apiError?.code ?? `HTTP_${error.response.status}`,
        status: error.response.status,
        details: apiError?.details,
      });
    }
    if (error.code === 'ECONNABORTED') {
      return new ApiError('The request timed out. Try again.', { code: 'TIMEOUT' });
    }
    return new ApiError('Unable to reach the server. Check your connection and try again.', { code: 'NETWORK_ERROR' });
  }
  return new ApiError(error?.message ?? 'An unexpected error occurred.', { code: 'UNKNOWN_ERROR' });
}

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalized = normalizeError(error);
    if (normalized.status === 401 && unauthorizedHandler) unauthorizedHandler(normalized);
    return Promise.reject(normalized);
  },
);

async function request(config) {
  try {
    const { data: body, status } = await client.request(config);
    if (body && body.success === false) {
      throw new ApiError(body.error?.message ?? 'The request could not be completed.', {
        code: body.error?.code,
        status,
        details: body.error?.details,
      });
    }
    if (body === '' || body == null) return null;
    return 'data' in body ? body.data : body;
  } catch (error) {
    throw normalizeError(error);
  }
}

export const http = {
  get: (url, config) => request({ ...config, method: 'get', url }),
  post: (url, data, config) => request({ ...config, method: 'post', url, data }),
  put: (url, data, config) => request({ ...config, method: 'put', url, data }),
  patch: (url, data, config) => request({ ...config, method: 'patch', url, data }),
  delete: (url, config) => request({ ...config, method: 'delete', url }),
  /** Multipart upload with optional progress callback (0–100). */
  upload: (url, formData, { onProgress, ...config } = {}) =>
    request({
      ...config,
      method: 'post',
      url,
      data: formData,
      onUploadProgress: (event) => {
        if (onProgress && event.total) onProgress(Math.round((event.loaded * 100) / event.total));
      },
    }),
};

export default client;
