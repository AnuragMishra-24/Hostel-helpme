import { http } from './api';
import { ENDPOINTS } from './endpoints';
import { withMock } from './withMock';
import * as mock from '@/mock/fees';

/**
 * Display-only — there is no payment API.
 * getMyFees() → { academicYear, roomType, totalAmount, paidAmount, remainingAmount,
 *   status: 'paid'|'partial'|'unpaid', lastPaymentAt } | null
 */
export const feeService = {
  getMyFees: () =>
    withMock(
      () => mock.getMyFees(),
      () => http.get(ENDPOINTS.fees.mine),
    ),
};
