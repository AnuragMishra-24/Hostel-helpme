import { AlertCircle } from 'lucide-react';
import Button from './Button';

/** `children` renders beside the retry button for a secondary action. */
export default function ErrorState({ title = 'Unable to load this content', message, onRetry, children }) {
  return (
    <div className="state state--error" role="alert">
      <span className="state__icon" aria-hidden="true"><AlertCircle size={20} /></span>
      <h3 className="state__title">{title}</h3>
      {message && <p className="state__description">{message}</p>}
      {(onRetry || children) && (
        <div className="state__action row" style={{ justifyContent: 'center' }}>
          {onRetry && <Button variant="secondary" onClick={onRetry}>Try again</Button>}
          {children}
        </div>
      )}
    </div>
  );
}
