import { http } from './api';
import { ENDPOINTS } from './endpoints';
import { withMock } from './withMock';
import * as mock from '@/mock/mess';

/**
 * getMenu() → { effectiveFrom, timings: { breakfast, lunch, snacks, dinner }, notes,
 *   days: [{ day: 'monday'…'sunday', meals: { breakfast: string[], lunch, snacks, dinner } }] }
 */
export const messService = {
  getMenu: (params) =>
    withMock(
      () => mock.getMenu(params),
      () => http.get(ENDPOINTS.mess.menu),
    ),
};
