import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import Button from './Button';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { cn } from '@/utils/cn';

const EXIT_MS = 140;

/** Accessible dialog: focus trap, Escape/overlay close, scroll lock, enter/exit animation. */
export default function Modal({ open, onClose, title, description, children, footer, size = 'md', dismissible = true }) {
  const [mounted, setMounted] = useState(open);
  const [closing, setClosing] = useState(false);
  const panelRef = useRef(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (open) {
      setMounted(true);
      setClosing(false);
      return undefined;
    }
    if (!mounted) return undefined;
    setClosing(true);
    const timer = setTimeout(() => { setMounted(false); setClosing(false); }, EXIT_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useFocusTrap(panelRef, mounted && open, dismissible ? onClose : undefined);

  useEffect(() => {
    if (!mounted) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [mounted]);

  if (!mounted) return null;

  return createPortal(
    <div
      className={cn('modal-overlay', closing && 'is-closing')}
      onMouseDown={(event) => { if (dismissible && event.target === event.currentTarget) onClose(); }}
    >
      <div
        ref={panelRef}
        className={cn('modal', size !== 'md' && `modal--${size}`)}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
      >
        <div className="modal__header">
          <div>
            <h2 className="modal__title" id={titleId}>{title}</h2>
            {description && <p className="modal__description" id={descriptionId}>{description}</p>}
          </div>
          {dismissible && (
            <Button variant="ghost" size="sm" icon onClick={onClose} aria-label="Close dialog"><X size={18} aria-hidden="true" /></Button>
          )}
        </div>
        {children && <div className="modal__body">{children}</div>}
        {footer && <div className="modal__footer">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
