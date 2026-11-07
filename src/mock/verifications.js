import ApiError from '@/services/ApiError';
import { readUsers, requireRole, writeUsers } from './users';

const toRegistration = ({ id, name, email, phone, enrollmentNumber, status, createdAt }) => ({
  id, name, email, phone, enrollmentNumber, status, createdAt,
});

export function getRegistrations({ status = 'pending' } = {}) {
  requireRole('warden');
  const items = readUsers()
    .filter((user) => user.role === 'student' && user.status === status)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .map(toRegistration);
  return { items, page: 1, pageSize: items.length, total: items.length };
}

export function reviewRegistration(id, decision) {
  requireRole('warden');
  if (decision !== 'approved' && decision !== 'rejected') {
    throw new ApiError('Decision must be approved or rejected.', { code: 'VALIDATION_ERROR', status: 400 });
  }
  const users = readUsers();
  const target = users.find((user) => user.id === id && user.role === 'student');
  if (!target) throw new ApiError('Registration not found.', { code: 'NOT_FOUND', status: 404 });
  if (target.status !== 'pending') {
    throw new ApiError('This registration has already been reviewed.', { code: 'INVALID_STATE', status: 409 });
  }
  const updated = { ...target, status: decision };
  writeUsers(users.map((user) => (user.id === id ? updated : user)));
  return toRegistration(updated);
}
