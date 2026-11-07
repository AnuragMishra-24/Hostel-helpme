import { forwardRef, useId } from 'react';
import { ChevronDown } from 'lucide-react';
import FormField, { describedBy } from './FormField';
import { cn } from '@/utils/cn';

/** options: [{ value, label }]. Uses the native <select> for reliable mobile behaviour. */
const Select = forwardRef(function Select({ label, hint, error, options, placeholder, id, required, className, ...rest }, ref) {
  const autoId = useId();
  const selectId = id ?? autoId;
  return (
    <FormField id={selectId} label={label} hint={hint} error={error} required={required}>
      <div className="control-wrap">
        <select
          ref={ref}
          id={selectId}
          className={cn('control', className)}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(selectId, { hint: hint && !error, error })}
          required={required}
          {...rest}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
        <ChevronDown className="control-wrap__chevron" size={16} aria-hidden="true" />
      </div>
    </FormField>
  );
});

export default Select;
