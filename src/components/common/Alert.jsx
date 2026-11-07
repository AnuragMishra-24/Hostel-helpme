import { AlertCircle, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { cn } from '@/utils/cn';

const ICONS = { info: Info, success: CheckCircle2, warning: AlertTriangle, danger: AlertCircle };

/** Inline message. variant: info | success | warning | danger */
export default function Alert({ variant = 'info', title, children, className }) {
  const Icon = ICONS[variant];
  return (
    <div className={cn('alert', `alert--${variant}`, className)} role={variant === 'danger' ? 'alert' : 'status'}>
      <Icon className="alert__icon" size={18} aria-hidden="true" />
      <div>
        {title && <p className="alert__title">{title}</p>}
        {children && <p className="alert__body">{children}</p>}
      </div>
    </div>
  );
}
