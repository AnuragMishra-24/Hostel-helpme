import { http } from './api';
import { ENDPOINTS } from './endpoints';
import { withMock } from './withMock';
import * as mock from '@/mock/verifications';

/**
 * Warden-only (enforced by the backend):
 *   getRegistrations({ status }) → { items: [{ id, name, email, phone, enrollmentNumber, status, createdAt }], page, pageSize, total }
 *   reviewRegistration(id, decision) → registration   (decision: 'approved' | 'rejected')
 */
export const verificationService = {
  getRegistrations: (params) =>
    withMock(() => mock.getRegistrations(params), () => http.get(ENDPOINTS.verifications.list, { params })),
  reviewRegistration: (id, decision) =>
    withMock(
      () => mock.reviewRegistration(id, decision),
      () => http.patch(ENDPOINTS.verifications.review(id), { decision }),
    ),
};
