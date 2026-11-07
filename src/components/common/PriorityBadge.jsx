import Badge from './Badge';
import { PRIORITY_META } from '@/constants/status';

/** Complaint priority. Rendered without a dot so it reads differently from a status. */
export default function PriorityBadge({ priority }) {
  const meta = PRIORITY_META[priority] ?? { label: String(priority ?? 'Unknown'), variant: 'neutral' };
  return <Badge variant={meta.variant}>{meta.label}</Badge>;
}
