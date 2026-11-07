export const ROLES = Object.freeze({
  STUDENT: 'student',
  WARDEN: 'warden',
  ADMIN: 'admin',
});

export const ROLE_LABELS = Object.freeze({
  student: 'Student',
  warden: 'Warden',
  admin: 'College Admin',
});

export const ROLE_BASE_PATH = Object.freeze({
  student: '/student',
  warden: '/warden',
  admin: '/admin',
});

export const ROLE_HOME = Object.freeze({
  student: '/student/dashboard',
  warden: '/warden/dashboard',
  admin: '/admin/dashboard',
});

export const PATHS = Object.freeze({
  LOGIN: '/login',
  SIGNUP: '/signup',
  VERIFY_OTP: '/verify-otp',
  ACCOUNT_STATUS: '/account-status',
  COMPONENT_SHOWCASE: '/dev/components',
});
