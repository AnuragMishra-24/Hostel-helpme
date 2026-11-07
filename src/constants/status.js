// Display metadata for status/priority values. Keys are the values the API
// is expected to return (see README → API conventions).
export const COMPLAINT_STATUSES = ['pending', 'assigned', 'in_progress', 'resolved', 'closed'];
export const PRIORITIES = ['low', 'medium', 'high', 'critical'];

export const STATUS_META = Object.freeze({
  pending: { label: 'Pending', variant: 'warning' },
  assigned: { label: 'Assigned', variant: 'info' },
  in_progress: { label: 'In progress', variant: 'primary' },
  resolved: { label: 'Resolved', variant: 'success' },
  closed: { label: 'Closed', variant: 'neutral' },
  // Room-change requests
  approved: { label: 'Approved', variant: 'success' },
  rejected: { label: 'Rejected', variant: 'danger' },
});

export const PRIORITY_META = Object.freeze({
  low: { label: 'Low', variant: 'neutral' },
  medium: { label: 'Medium', variant: 'info' },
  high: { label: 'High', variant: 'warning' },
  critical: { label: 'Critical', variant: 'danger' },
});
