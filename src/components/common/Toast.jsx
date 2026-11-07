import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';
import Button from './Button';

const ICONS = { success: CheckCircle2, error: AlertCircle, warning: AlertTriangle, info: Info };

/** Presentational toast list. State lives in ToastContext. */
export default function ToastViewport({ toasts, onDismiss }) {
  return (
    <div className="toast-region" role="region" aria-label="Notifications">
      {toasts.map((toast) => {
        const Icon = ICONS[toast.variant] ?? Info;
        return (
          <div
            key={toast.id}
            className={`toast toast--${toast.variant}${toast.leaving ? ' is-leaving' : ''}`}
            role={toast.variant === 'error' ? 'alert' : 'status'}
          >
            <Icon className="toast__icon" size={18} aria-hidden="true" />
            <div className="toast__content">
              {toast.title && <p className="toast__title">{toast.title}</p>}
              <p className="toast__message">{toast.message}</p>
            </div>
            <Button variant="ghost" size="sm" icon onClick={() => onDismiss(toast.id)} aria-label="Dismiss notification">
              <X size={16} aria-hidden="true" />
            </Button>
          </div>
        );
      })}
    </div>
  );
}
