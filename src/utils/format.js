const dateFormatter = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : dateFormatter.format(date);
}

export function getInitials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

/** "aarav.sharma@college.edu" → "a***@college.edu";  "9876543210" → "******3210" */
export function maskIdentifier(method, value) {
  if (method === 'email') {
    const [local, domain] = value.split('@');
    return `${local[0] ?? ''}***@${domain ?? ''}`;
  }
  return `${'*'.repeat(Math.max(value.length - 4, 0))}${value.slice(-4)}`;
}

const dateTimeFormatter = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit',
});

export function formatDateTime(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : dateTimeFormatter.format(date);
}

const currencyFormatter = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

export function formatCurrency(amount) {
  return amount == null || Number.isNaN(Number(amount)) ? '—' : currencyFormatter.format(amount);
}

export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Looks up the display label for a value in a [{ value, label }] list. */
export function labelFor(options, value) {
  return options.find((option) => option.value === value)?.label ?? value ?? '—';
}
