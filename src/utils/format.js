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
