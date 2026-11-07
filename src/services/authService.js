import { http } from './api';
import { ENDPOINTS } from './endpoints';
import { withMock } from './withMock';
import * as mock from '@/mock/auth';

/**
 * Authentication contract (identical for mock and real backend):
 *   sendOtp({ method, identifier })          → { expiresInSeconds, resendAfterSeconds, devOtp? }
 *   verifyOtp({ method, identifier, otp })   → { token, user }
 *   signup({ name, email, phone, enrollmentNumber }) → { user }   (user.status === 'pending')
 *   getCurrentUser()                         → user   (resolved from the Bearer token)
 *   logout()                                 → null
 * `method` is 'email' | 'phone'. `devOtp` exists only in mock mode.
 */
export const authService = {
  sendOtp: (payload) => withMock(() => mock.sendOtp(payload), () => http.post(ENDPOINTS.auth.sendOtp, payload)),
  verifyOtp: (payload) => withMock(() => mock.verifyOtp(payload), () => http.post(ENDPOINTS.auth.verifyOtp, payload)),
  signup: (payload) => withMock(() => mock.signup(payload), () => http.post(ENDPOINTS.auth.signup, payload)),
  getCurrentUser: () => withMock(() => mock.getCurrentUser(), () => http.get(ENDPOINTS.auth.me)),
  logout: () => withMock(() => mock.logout(), () => http.post(ENDPOINTS.auth.logout)),
};
