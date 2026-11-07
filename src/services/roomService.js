import { http } from './api';
import { ENDPOINTS } from './endpoints';
import { withMock } from './withMock';
import * as mock from '@/mock/rooms';

// Phase 1: a single read method establishes the pattern. Methods are added
// in the phase that builds the matching module.
export const roomService = {
  getRooms: (params) =>
    withMock(
      () => mock.getRooms(params),
      () => http.get(ENDPOINTS.rooms.list, { params }),
    ),
};
