import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { authService } from '@/services/authService';
import { setUnauthorizedHandler } from '@/services/api';
import { tokenStorage } from '@/utils/tokenStorage';
import { ACCOUNT_STATUS } from '@/constants/auth';

export const AuthContext = createContext(null);

const SIGNED_OUT = { user: null, status: 'unauthenticated', error: null };

/**
 * Owns the session. status: 'loading' (restoring) | 'authenticated' | 'unauthenticated' | 'error' (restore failed).
 * Only the token is persisted; the user is re-fetched on load, so approval changes show up after a refresh.
 */
export function AuthProvider({ children }) {
  const [state, setState] = useState(() => (
    tokenStorage.getToken() ? { user: null, status: 'loading', error: null } : SIGNED_OUT
  ));

  const endSession = useCallback(() => {
    tokenStorage.clearToken();
    setState(SIGNED_OUT);
  }, []);

  const restoreSession = useCallback(async () => {
    if (!tokenStorage.getToken()) {
      setState(SIGNED_OUT);
      return;
    }
    setState({ user: null, status: 'loading', error: null });
    try {
      const user = await authService.getCurrentUser();
      setState({ user, status: 'authenticated', error: null });
    } catch (error) {
      if (error.status === 401) endSession();
      else setState({ user: null, status: 'error', error });
    }
  }, [endSession]);

  useEffect(() => { restoreSession(); }, [restoreSession]);

  // Any 401 from the real API ends the session; route guards then redirect to /login.
  useEffect(() => {
    setUnauthorizedHandler(endSession);
    return () => setUnauthorizedHandler(null);
  }, [endSession]);

  const verifyOtp = useCallback(async (payload) => {
    const { token, user } = await authService.verifyOtp(payload);
    tokenStorage.setToken(token);
    setState({ user, status: 'authenticated', error: null });
    return user;
  }, []);

  /** Re-fetches the current user (e.g. to see whether a pending account was approved). */
  const refreshUser = useCallback(async () => {
    try {
      const user = await authService.getCurrentUser();
      setState((prev) => ({ ...prev, user }));
      return user;
    } catch (error) {
      if (error.status === 401) endSession();
      throw error;
    }
  }, [endSession]);

  // The local session is cleared immediately; telling the server is best-effort.
  const logout = useCallback(() => {
    endSession();
    authService.logout().catch(() => {});
  }, [endSession]);

  const value = useMemo(() => ({
    user: state.user,
    status: state.status,
    error: state.error,
    isAuthenticated: state.status === 'authenticated',
    isApproved: state.user?.status === ACCOUNT_STATUS.APPROVED,
    sendOtp: authService.sendOtp,
    signup: authService.signup,
    verifyOtp,
    refreshUser,
    restoreSession,
    logout,
  }), [state, verifyOtp, refreshUser, restoreSession, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
