import { http } from './api';
import { ENDPOINTS } from './endpoints';
import { withMock } from './withMock';
import * as mock from '@/mock/notices';

/**
 * getNotices({ limit? }) → { items: Notice[], page, pageSize, total }, newest first, already limited to what this
 * student may see (hostel-wide + their block).
 * Notice: { id, title, content, scope: 'hostel'|'block', block: 'A'|'B'|'C'|'D'|null, important, publishedAt }
 */
export const noticeService = {
  getNotices: (params) =>
    withMock(
      () => mock.getNotices(params),
      () => http.get(ENDPOINTS.notices.list, { params }),
    ),
};
