import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Button from '@/components/common/Button';
import ErrorState from '@/components/common/ErrorState';
import LoadingState from '@/components/common/LoadingState';
import { useAuth } from '@/hooks/useAuth';
import { PATHS } from '@/constants/roles';
import { getHomePath, isAwaitingApproval, resolvePostLoginPath } from '@/utils/authRouting';

// Route guards are the client-side enforcement point. They improve UX only;
// the backend must still authorize every API request.

function SessionError({ standalone }) {
  const { error, restoreSession, logout } = useAuth();
  const state = (
    <ErrorState title="Unable to restore your session" message={error?.message} onRetry={restoreSession}>
      <Button variant="ghost" onClick={logout}>Sign out</Button>
    </ErrorState>
  );
  return standalone ? <div className="standalone">{state}</div> : state;
}

function SessionLoading({ standalone }) {
  const state = <LoadingState label="Checking your session…" />;
  return standalone ? <div className="standalone">{state}</div> : state;
}

/** Signed-in, approved users only — and only for the given role. */
export function ProtectedRoute({ role }) {
  const { user, status } = useAuth();
  const location = useLocation();

  if (status === 'loading') return <SessionLoading standalone />;
  if (status === 'error') return <SessionError standalone />;
  if (!user) return <Navigate to={PATHS.LOGIN} replace state={{ from: location.pathname }} />;
  if (isAwaitingApproval(user)) return <Navigate to={PATHS.ACCOUNT_STATUS} replace />;
  if (user.role !== role) return <Navigate to={getHomePath(user)} replace />;
  return <Outlet />;
}

/** Login, signup and OTP pages: signed-in users are sent on to where they belong. */
export function GuestRoute() {
  const { user, status } = useAuth();
  const location = useLocation();

  if (status === 'loading') return <SessionLoading />;
  if (user) return <Navigate to={resolvePostLoginPath(user, location.state?.from)} replace />;
  return <Outlet />;
}

/** The "awaiting approval / not approved" page: signed in but not yet approved. */
export function AccountStatusRoute() {
  const { user, status } = useAuth();

  if (status === 'loading') return <SessionLoading />;
  if (status === 'error') return <SessionError />;
  if (!user) return <Navigate to={PATHS.LOGIN} replace />;
  if (!isAwaitingApproval(user)) return <Navigate to={getHomePath(user)} replace />;
  return <Outlet />;
}
