import Badge from './Badge';
import { STATUS_META } from '@/constants/status';

/** Complaint lifecycle and room-request statuses. Always dot + text, never colour alone. */
export default function StatusBadge({ status }) {
  const meta = STATUS_META[status] ?? { label: String(status ?? 'Unknown'), variant: 'neutral' };
  return <Badge variant={meta.variant} dot>{meta.label}</Badge>;
}
