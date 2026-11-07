import { forwardRef, useId } from 'react';
import FormField, { describedBy } from './FormField';
import { cn } from '@/utils/cn';

const Textarea = forwardRef(function Textarea({ label, hint, error, id, required, className, ...rest }, ref) {
  const autoId = useId();
  const textareaId = id ?? autoId;
  return (
    <FormField id={textareaId} label={label} hint={hint} error={error} required={required}>
      <textarea
        ref={ref}
        id={textareaId}
        className={cn('control', className)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(textareaId, { hint: hint && !error, error })}
        required={required}
        {...rest}
      />
    </FormField>
  );
});

export default Textarea;
