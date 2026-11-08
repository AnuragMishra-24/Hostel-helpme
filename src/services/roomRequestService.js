import { http } from './api';
import { ENDPOINTS } from './endpoints';
import { withMock } from './withMock';
import * as mock from '@/mock/roomRequests';

/**
 * Student room-change requests (the warden alone decides and allocates):
 *   getRequests() → { items: RoomRequest[], … }   newest first
 *   createRequest({ reason, description, preferredBlock?, preferredRoomType? }) → RoomRequest
 * RoomRequest: { id, currentRoom: { block, roomNumber, roomType }, preferredBlock, preferredRoomType, reason,
 *   description, status: 'pending'|'under_review'|'approved'|'rejected', createdAt, updatedAt,
 *   decision: { note, decidedBy, at } | null }
 * Errors: NO_ROOM (409), REQUEST_EXISTS (409).
 */
export const roomRequestService = {
  getRequests: () => withMock(() => mock.getRequests(), () => http.get(ENDPOINTS.roomRequests.list)),
  createRequest: (payload) =>
    withMock(() => mock.createRequest(payload), () => http.post(ENDPOINTS.roomRequests.list, payload)),
};
