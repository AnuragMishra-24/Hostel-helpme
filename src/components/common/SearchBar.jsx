import { Search, X } from 'lucide-react';
import { cn } from '@/utils/cn';

/** Controlled search input with a clear button. Pair with useDebounce for API-backed search. */
export default function SearchBar({ value, onChange, placeholder = 'Search', label = 'Search', className }) {
  return (
    <div className={cn('control-wrap', className)} role="search">
      <Search className="control-wrap__icon" size={16} aria-hidden="true" />
      <input
        type="search"
        className="control control--with-icon control--with-action"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={label}
      />
      {value && (
        <button type="button" className="control-wrap__action" onClick={() => onChange('')} aria-label="Clear search">
          <X size={16} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
