// Thin abstraction over where the session token lives.
// The API client reads it; the auth layer (Phase 2) writes it.
// Swap the storage mechanism here without touching any other file.
const TOKEN_KEY = 'hostel-helpme.token';

export const tokenStorage = {
  getToken() {
    try {
      return window.localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  setToken(token) {
    try {
      window.localStorage.setItem(TOKEN_KEY, token);
    } catch {
      /* storage unavailable (private mode, etc.) */
    }
  },
  clearToken() {
    try {
      window.localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* ignore */
    }
  },
};
