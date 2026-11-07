import { ChevronDown, ChevronRight, LogOut, Menu, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button';
import Dropdown from '@/components/common/Dropdown';
import { useAuth } from '@/hooks/useAuth';
import { NAV_BY_ROLE } from '@/constants/navigation';
import { PATHS, ROLE_BASE_PATH, ROLE_LABELS } from '@/constants/roles';
import { getInitials } from '@/utils/format';

export default function Header({ role, onMenuClick }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const current = NAV_BY_ROLE[role]?.find((item) => pathname.startsWith(item.path));

  const menuItems = [
    {
      type: 'header',
      content: (
        <>
          <p style={{ fontWeight: 'var(--weight-medium)' }}>{user?.name ?? 'Account'}</p>
          {user?.email && <p className="text-sm text-muted">{user.email}</p>}
        </>
      ),
    },
    { type: 'separator' },
    { label: 'Profile', icon: User, to: `${ROLE_BASE_PATH[role]}/profile` },
    {
      label: 'Log out',
      icon: LogOut,
      tone: 'danger',
      onSelect: () => {
        logout();
        navigate(PATHS.LOGIN, { replace: true });
      },
    },
  ];

  return (
    <header className="header">
      <div className="header__start">
        <Button variant="ghost" icon className="header__menu" onClick={onMenuClick} aria-label="Open navigation">
          <Menu size={20} aria-hidden="true" />
        </Button>
        <p className="header__crumb">
          <span className="header__crumb-root">{ROLE_LABELS[role]}</span>
          <ChevronRight className="header__crumb-sep" size={14} aria-hidden="true" />
          <strong>{current?.label ?? 'Hostel HelpMe'}</strong>
        </p>
      </div>
      <Dropdown
        items={menuItems}
        renderTrigger={(triggerProps) => (
          <button type="button" className="user-trigger" aria-label="Account menu" {...triggerProps}>
            <span className="avatar" aria-hidden="true">{getInitials(user?.name)}</span>
            <span className="user-trigger__name">{user?.name ?? ''}</span>
            <ChevronDown size={16} aria-hidden="true" />
          </button>
        )}
      />
    </header>
  );
}
