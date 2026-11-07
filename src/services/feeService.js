import { http } from './api';
import { ENDPOINTS } from './endpoints';
import { withMock } from './withMock';
import * as mock from '@/mock/fees';

// Phase 1: a single read method establishes the pattern. Methods are added
// in the phase that builds the matching module.
export const feeService = {
  getMyFees: () =>
    withMock(
      () => mock.getMyFees(),
      () => http.get(ENDPOINTS.fees.mine),
    ),
};
