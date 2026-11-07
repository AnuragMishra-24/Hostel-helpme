// Mock user store shared by the mock auth and verification modules.
// Persisted in localStorage so signups, approvals and sessions survive a refresh.
// To reset during development:  localStorage.removeItem('hostel-helpme.mock.users')
import ApiError from '@/services/ApiError';
import { tokenStorage } from '@/utils/tokenStorage';

const STORAGE_KEY = 'hostel-helpme.mock.users';
const TOKEN_PREFIX = 'mock-token.';

const SEED_USERS = [
  { id: 'u-student', name: 'Aarav Sharma', email: 'aarav.sharma@college.edu', phone: '9876543210', role: 'student', status: 'approved', enrollmentNumber: 'CS21B1042', createdAt: '2026-07-14T09:30:00Z' },
  { id: 'u-warden', name: 'Meera Iyer', email: 'meera.iyer@college.edu', phone: '9876500001', role: 'warden', status: 'approved', createdAt: '2026-06-01T09:00:00Z' },
  { id: 'u-admin', name: 'Rohan Kapoor', email: 'rohan.kapoor@college.edu', phone: '9876500002', role: 'admin', status: 'approved', createdAt: '2026-06-01T09:00:00Z' },
  { id: 'u-pending-1', name: 'Ishita Verma', email: 'ishita.verma@college.edu', phone: '9876500003', role: 'student', status: 'pending', enrollmentNumber: 'EC22B2017', createdAt: '2026-11-04T11:20:00Z' },
  { id: 'u-pending-2', name: 'Neha Gupta', email: 'neha.gupta@college.edu', phone: '9876500005', role: 'student', status: 'pending', enrollmentNumber: 'ME22B3105', createdAt: '2026-11-05T15:05:00Z' },
  { id: 'u-rejected', name: 'Kabir Malhotra', email: 'kabir.malhotra@college.edu', phone: '9876500004', role: 'student', status: 'rejected', enrollmentNumber: 'CE21B4410', createdAt: '2026-10-28T10:10:00Z' },
];

let memoryFallback = null;

export function readUsers() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    /* fall through to defaults */
  }
  return memoryFallback ?? SEED_USERS.map((user) => ({ ...user }));
}

export function writeUsers(users) {
  memoryFallback = users;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch {
    /* storage unavailable — keep in memory only */
  }
}

/** The shape the API returns for a user. */
export function toPublicUser({ id, name, email, phone, role, status, enrollmentNumber }) {
  return { id, name, email, phone, role, status, ...(enrollmentNumber && { enrollmentNumber }) };
}

export const createToken = (user) => `${TOKEN_PREFIX}${user.id}`;

/** Resolves the caller from the stored token, exactly as the real backend resolves it from the Bearer header. */
export function getSessionUser() {
  const token = tokenStorage.getToken();
  const id = token?.startsWith(TOKEN_PREFIX) ? token.slice(TOKEN_PREFIX.length) : null;
  const user = id ? readUsers().find((candidate) => candidate.id === id) : null;
  if (!user) throw new ApiError('Your session has expired. Sign in again.', { code: 'UNAUTHORIZED', status: 401 });
  return user;
}

/** Mirrors server-side authorization: the mock rejects callers with the wrong role. */
export function requireRole(role) {
  const user = getSessionUser();
  if (user.role !== role) throw new ApiError('You do not have permission to do this.', { code: 'FORBIDDEN', status: 403 });
  return user;
}
