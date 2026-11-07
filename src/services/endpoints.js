// Every backend path used by the frontend lives here — never inline a URL
// string in a service or component. Paths are relative to VITE_API_BASE_URL.
// Phase 1 only registers the read endpoints needed to prove the pattern;
// each phase extends this list and Phase 7 formalises it in API_CONTRACT.md.
export const ENDPOINTS = Object.freeze({
  auth: {
    sendOtp: '/auth/otp/send',
    verifyOtp: '/auth/otp/verify',
    signup: '/auth/signup',
    me: '/auth/me',
    logout: '/auth/logout',
  },
  verifications: {
    list: '/verifications',
    review: (id) => `/verifications/${id}`,
  },
  complaints: { list: '/complaints' },
  rooms: { list: '/rooms' },
  notices: { list: '/notices' },
  fees: { mine: '/fees/me' },
  mess: { menu: '/mess/menu' },
});
