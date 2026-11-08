import { Link } from 'react-router-dom';
import { ClipboardList, DoorOpen, Megaphone, Plus } from 'lucide-react';
import { STUDENT_PATHS } from '@/constants/roles';

const ACTIONS = [
  { label: 'Raise complaint', to: STUDENT_PATHS.newComplaint, icon: Plus, primary: true },
  { label: 'Track complaints', to: STUDENT_PATHS.complaints, icon: ClipboardList },
  { label: 'Request room change', to: STUDENT_PATHS.roomRequest, icon: DoorOpen },
  { label: 'View notices', to: STUDENT_PATHS.notices, icon: Megaphone },
];

export default function QuickActions() {
  return (
    <nav className="quick-actions" aria-label="Quick actions">
      {ACTIONS.map(({ label, to, icon: Icon, primary }) => (
        <Link key={label} to={to} className={`quick-actions__item${primary ? ' quick-actions__item--primary' : ''}`}>
          <Icon size={18} aria-hidden="true" />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}
