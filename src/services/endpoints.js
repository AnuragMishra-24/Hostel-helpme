// Every backend path used by the frontend lives here — never inline a URL
// string in a service or component. Paths are relative to VITE_API_BASE_URL.
// Phase 7 formalises these in API_CONTRACT.md.
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
  students: { profile: '/students/me' },
  complaints: {
    list: '/complaints',
    summary: '/complaints/summary',
    detail: (id) => `/complaints/${id}`,
    evidence: '/complaints/evidence',
  },
  roomRequests: { list: '/room-requests' },
  rooms: { list: '/rooms' },
  notices: { list: '/notices' },
  fees: { mine: '/fees/me' },
  mess: { menu: '/mess/menu' },
  rules: { list: '/hostel/rules' },
});
