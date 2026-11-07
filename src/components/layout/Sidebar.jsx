import { useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { X } from 'lucide-react';
import Brand from '@/components/common/Brand';
import Button from '@/components/common/Button';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { NAV_BY_ROLE } from '@/constants/navigation';
import { ROLE_LABELS } from '@/constants/roles';
import { cn } from '@/utils/cn';

/** Fixed sidebar on desktop (≥1024px); slide-in drawer with focus trap below that. */
export default function Sidebar({ role, open, onClose }) {
  const ref = useRef(null);
  const items = NAV_BY_ROLE[role] ?? [];
  useFocusTrap(ref, open, onClose);

  return (
    <aside ref={ref} tabIndex={-1} className={cn('sidebar', open && 'is-open')} aria-label="Sidebar">
      <div className="sidebar__brand">
        <Brand subtitle={`${ROLE_LABELS[role]} portal`} />
        <Button variant="ghost" size="sm" icon className="sidebar__close" onClick={onClose} aria-label="Close navigation">
          <X size={18} aria-hidden="true" />
        </Button>
      </div>
      <nav className="sidebar__nav" aria-label="Primary">
        {items.map(({ key, label, path, icon: Icon }) => (
          <NavLink key={key} to={path} className={({ isActive }) => cn('nav-link', isActive && 'is-active')}>
            <Icon size={18} aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
