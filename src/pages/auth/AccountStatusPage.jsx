import { useState } from 'react';
import { Clock, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import StatusBadge from '@/components/common/StatusBadge';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/hooks/useAuth';
import { ACCOUNT_STATUS } from '@/constants/auth';
import { PATHS } from '@/constants/roles';

const COPY = {
  [ACCOUNT_STATUS.PENDING]: {
    icon: Clock,
    title: 'Awaiting verification',
    body: 'Your registration has been submitted. Your account is awaiting verification by the hostel warden.',
  },
  [ACCOUNT_STATUS.REJECTED]: {
    icon: XCircle,
    title: 'Registration not approved',
    body: 'The warden could not verify your registration. Contact the hostel office if you think this is a mistake.',
  },
};

/** Shown to signed-in users whose account is not approved. They cannot reach the app until it is. */
export default function AccountStatusPage() {
  const { user, refreshUser, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [checking, setChecking] = useState(false);

  const copy = COPY[user.status] ?? COPY[ACCOUNT_STATUS.PENDING];
  const Icon = copy.icon;
  const isPending = user.status === ACCOUNT_STATUS.PENDING;

  const checkStatus = async () => {
    setChecking(true);
    try {
      const latest = await refreshUser();
      if (latest.status === ACCOUNT_STATUS.APPROVED) toast.success('Your account has been approved.');
      else toast.info('Your account is still awaiting verification.');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setChecking(false);
    }
  };

  const signOut = () => {
    logout();
    navigate(PATHS.LOGIN, { replace: true });
  };

  return (
    <Card className="auth__card">
      <div className="auth__status">
        <span className="state__icon" aria-hidden="true"><Icon size={20} /></span>
        <h1 className="auth__title">{copy.title}</h1>
        <p className="auth__lead">{copy.body}</p>
        <dl className="auth__summary">
          <div><dt>Name</dt><dd>{user.name}</dd></div>
          <div><dt>Email</dt><dd>{user.email}</dd></div>
          <div><dt>Status</dt><dd><StatusBadge status={user.status} /></dd></div>
        </dl>
        <div className="auth__status-actions">
          {isPending && <Button onClick={checkStatus} loading={checking}>Check status</Button>}
          <Button variant="secondary" onClick={signOut}>Log out</Button>
        </div>
      </div>
    </Card>
  );
}
