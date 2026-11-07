// Mock authentication. Behaves like the future backend; UI code never imports this.
//
// OTP: no email or SMS is sent. Every code is MOCK_OTP, and sendOtp() returns it as
// `devOtp` so the UI can show a development notice. A real backend never returns `devOtp`.
import ApiError from '@/services/ApiError';
import { normalizeEmail, normalizePhone } from '@/utils/validators';
import { createToken, getSessionUser, readUsers, toPublicUser, writeUsers } from './users';

export const MOCK_OTP = '123456';
const OTP_EXPIRES_IN_SECONDS = 300;
const OTP_RESEND_AFTER_SECONDS = 30;

function findAccount(method, identifier) {
  const users = readUsers();
  return method === 'email'
    ? users.find((user) => user.email === normalizeEmail(identifier))
    : users.find((user) => user.phone === normalizePhone(identifier));
}

function requireAccount(method, identifier) {
  const account = findAccount(method, identifier);
  if (!account) {
    const what = method === 'email' ? 'email' : 'number';
    throw new ApiError(`No account found for that ${what}. New student? Create an account first.`, { code: 'ACCOUNT_NOT_FOUND', status: 404 });
  }
  return account;
}

export function sendOtp({ method, identifier }) {
  requireAccount(method, identifier);
  return { expiresInSeconds: OTP_EXPIRES_IN_SECONDS, resendAfterSeconds: OTP_RESEND_AFTER_SECONDS, devOtp: MOCK_OTP };
}

export function verifyOtp({ method, identifier, otp }) {
  const account = requireAccount(method, identifier);
  if (otp !== MOCK_OTP) {
    throw new ApiError('Incorrect code. Check the code and try again.', { code: 'INVALID_OTP', status: 400 });
  }
  return { token: createToken(account), user: toPublicUser(account) };
}

export function signup({ name, email, phone, enrollmentNumber }) {
  const users = readUsers();
  const normalizedEmail = normalizeEmail(email ?? '');
  const normalizedPhone = normalizePhone(phone ?? '');

  if (!name?.trim() || !normalizedEmail || !normalizedPhone || !enrollmentNumber?.trim()) {
    throw new ApiError('Fill in all required fields.', { code: 'VALIDATION_ERROR', status: 400 });
  }
  if (users.some((user) => user.email === normalizedEmail)) {
    throw new ApiError('An account with this email already exists.', { code: 'ACCOUNT_EXISTS', status: 409, details: { field: 'email' } });
  }
  if (users.some((user) => user.phone === normalizedPhone)) {
    throw new ApiError('An account with this number already exists.', { code: 'ACCOUNT_EXISTS', status: 409, details: { field: 'phone' } });
  }

  const user = {
    id: `u-${Date.now().toString(36)}`,
    name: name.trim(),
    email: normalizedEmail,
    phone: normalizedPhone,
    role: 'student',
    status: 'pending',
    enrollmentNumber: enrollmentNumber.trim(),
    createdAt: new Date().toISOString(),
  };
  writeUsers([...users, user]);
  return { user: toPublicUser(user) };
}

export const getCurrentUser = () => toPublicUser(getSessionUser());

export const logout = () => null;
