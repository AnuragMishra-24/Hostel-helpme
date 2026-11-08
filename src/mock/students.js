import { requireRole, toPublicUser } from './users';

// Room allocation is controlled by the warden; only some mock students have one.
const ASSIGNMENTS = {
  'u-student': { block: 'B', roomNumber: '301', roomType: 'ac_double', capacity: 2, occupied: 2 },
};

export const getAssignment = (userId) => ASSIGNMENTS[userId] ?? null;

export function getProfile() {
  const user = requireRole('student');
  return { ...toPublicUser(user), registeredAt: user.createdAt, hostel: getAssignment(user.id) };
}
