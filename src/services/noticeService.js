import { http } from './api';
import { ENDPOINTS } from './endpoints';
import { withMock } from './withMock';
import * as mock from '@/mock/notices';

// Phase 1: a single read method establishes the pattern. Methods are added
// in the phase that builds the matching module.
export const noticeService = {
  getNotices: (params) =>
    withMock(
      () => mock.getNotices(params),
      () => http.get(ENDPOINTS.notices.list, { params }),
    ),
};
