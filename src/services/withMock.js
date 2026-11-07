import { USE_MOCK, MOCK_LATENCY_MS } from '@/config/env';
import { delay } from '@/mock/delay';

/**
 * Chooses the mock or real implementation for a service method.
 * Both functions must resolve with the same unwrapped `data` shape and
 * reject with ApiError, so UI code never knows which one ran.
 *
 *   getComplaints: (params) => withMock(
 *     () => mock.getComplaints(params),
 *     () => http.get(ENDPOINTS.complaints.list, { params }),
 *   )
 */
export async function withMock(mockFn, realFn) {
  if (!USE_MOCK) return realFn();
  await delay(MOCK_LATENCY_MS);
  return mockFn();
}
