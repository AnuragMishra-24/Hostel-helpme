/** Normalised error thrown by every service call, real or mock. */
export default class ApiError extends Error {
  constructor(message, { code = 'UNKNOWN_ERROR', status = 0, details } = {}) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}
