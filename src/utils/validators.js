import { AUTH_METHODS } from '@/constants/auth';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[6-9]\d{9}$/;
const ENROLLMENT_PATTERN = /^[A-Za-z0-9/-]{4,20}$/;

export const normalizeEmail = (value) => value.trim().toLowerCase();

/** Digits only; drops a leading +91 / 0 so "+91 98765 43210" becomes "9876543210". */
export function normalizePhone(value) {
  const digits = value.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1);
  return digits;
}

export const normalizeIdentifier = (method, value) =>
  (method === AUTH_METHODS.EMAIL ? normalizeEmail(value) : normalizePhone(value));

/** Each validator returns an error message, or '' when the value is valid. */
export function validateEmail(value) {
  if (!value.trim()) return 'Enter your college email.';
  return EMAIL_PATTERN.test(normalizeEmail(value)) ? '' : 'Enter a valid email address.';
}

export function validatePhone(value) {
  if (!value.trim()) return 'Enter your mobile number.';
  return PHONE_PATTERN.test(normalizePhone(value)) ? '' : 'Enter a valid 10-digit mobile number.';
}

export const validateIdentifier = (method, value) =>
  (method === AUTH_METHODS.EMAIL ? validateEmail(value) : validatePhone(value));

export function validateName(value) {
  return value.trim().length >= 2 ? '' : 'Enter your full name.';
}

export function validateEnrollment(value) {
  if (!value.trim()) return 'Enter your enrollment number.';
  return ENROLLMENT_PATTERN.test(value.trim()) ? '' : 'Use 4–20 letters, numbers, hyphens or slashes.';
}

export function countWords(text) {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}
