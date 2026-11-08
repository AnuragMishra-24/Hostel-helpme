import { http } from './api';
import { ENDPOINTS } from './endpoints';
import { withMock } from './withMock';
import * as mock from '@/mock/students';

/**
 * getProfile() → { id, name, email, phone, role, status, enrollmentNumber, registeredAt,
 *   hostel: { block, roomNumber, roomType, capacity, occupied } | null }
 * `hostel` is null until the warden allocates a room.
 */
export const studentService = {
  getProfile: () => withMock(() => mock.getProfile(), () => http.get(ENDPOINTS.students.profile)),
};
