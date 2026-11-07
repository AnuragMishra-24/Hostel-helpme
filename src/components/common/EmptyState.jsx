import { Inbox } from 'lucide-react';
import { cn } from '@/utils/cn';

export default function EmptyState({ icon: Icon = Inbox, title, description, action, bordered = false }) {
  return (
    <div className={cn('state', bordered && 'state--bordered')}>
      <span className="state__icon" aria-hidden="true"><Icon size={20} /></span>
      <h3 className="state__title">{title}</h3>
      {description && <p className="state__description">{description}</p>}
      {action && <div className="state__action">{action}</div>}
    </div>
  );
}
