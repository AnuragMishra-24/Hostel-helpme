import ApiError from '@/services/ApiError';
import { createCollection } from './storage';
import { getAssignment } from './students';
import { requireRole } from './users';

const SEED = [
  {
    id: 'RR-201', studentId: 'u-student', currentRoom: { block: 'B', roomNumber: '301', roomType: 'ac_double' },
    preferredBlock: 'A', preferredRoomType: 'ac_single', reason: 'academic',
    description: 'I would like a single room during my project semester so I can work late without disturbing others.',
    status: 'rejected', createdAt: '2026-09-02T10:00:00Z', updatedAt: '2026-09-05T16:30:00Z',
    decision: { note: 'No single rooms are available this semester. You may apply again next term.', decidedBy: 'Warden', at: '2026-09-05T16:30:00Z' },
  },
];

const store = createCollection('hostel-helpme.mock.roomRequests', SEED);
const ACTIVE = ['pending', 'under_review'];

const mine = (user) => store.read()
  .filter((request) => request.studentId === user.id)
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

const toApi = ({ studentId, ...request }) => request;

export function getRequests() {
  const user = requireRole('student');
  const items = mine(user).map(toApi);
  return { items, page: 1, pageSize: items.length, total: items.length };
}

export function createRequest({ reason, description, preferredBlock, preferredRoomType }) {
  const user = requireRole('student');
  const assignment = getAssignment(user.id);
  if (!assignment) {
    throw new ApiError('You need an allocated room before requesting a change.', { code: 'NO_ROOM', status: 409 });
  }
  if (!reason || !description?.trim()) {
    throw new ApiError('Fill in all required fields.', { code: 'VALIDATION_ERROR', status: 400 });
  }
  if (mine(user).some((request) => ACTIVE.includes(request.status))) {
    throw new ApiError('You already have an open room-change request.', { code: 'REQUEST_EXISTS', status: 409 });
  }
  const all = store.read();
  const now = new Date().toISOString();
  const request = {
    id: `RR-${Math.max(200, ...all.map((r) => Number(r.id.split('-')[1]))) + 1}`,
    studentId: user.id,
    currentRoom: { block: assignment.block, roomNumber: assignment.roomNumber, roomType: assignment.roomType },
    preferredBlock: preferredBlock || null,
    preferredRoomType: preferredRoomType || null,
    reason, description: description.trim(), status: 'pending', createdAt: now, updatedAt: now, decision: null,
  };
  store.write([...all, request]);
  return toApi(request);
}
