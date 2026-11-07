import { AlertCircle } from 'lucide-react';

export const hintId = (id) => `${id}-hint`;
export const errorId = (id) => `${id}-error`;

/** aria-describedby value for a control wrapped in <FormField id={id}>. */
export function describedBy(id, { hint, error }) {
  const ids = [];
  if (hint) ids.push(hintId(id));
  if (error) ids.push(errorId(id));
  return ids.length ? ids.join(' ') : undefined;
}

export default function FormField({ id, label, hint, error, required, children }) {
  return (
    <div className="field">
      {label && (
        <label className="field__label" htmlFor={id}>
          {label}
          {required && <span className="field__required" aria-hidden="true"> *</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className="field__hint" id={hintId(id)}>{hint}</p>}
      {error && (
        <p className="field__error" id={errorId(id)}>
          <AlertCircle size={14} aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
