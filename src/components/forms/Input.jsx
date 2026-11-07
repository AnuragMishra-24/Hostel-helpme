import { forwardRef, useId } from 'react';
import FormField, { describedBy } from './FormField';
import { cn } from '@/utils/cn';

const Input = forwardRef(function Input({ label, hint, error, icon: Icon, id, required, className, ...rest }, ref) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <FormField id={inputId} label={label} hint={hint} error={error} required={required}>
      <div className="control-wrap">
        {Icon && <Icon className="control-wrap__icon" size={16} aria-hidden="true" />}
        <input
          ref={ref}
          id={inputId}
          className={cn('control', Icon && 'control--with-icon', className)}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(inputId, { hint: hint && !error, error })}
          required={required}
          {...rest}
        />
      </div>
    </FormField>
  );
});

export default Input;
