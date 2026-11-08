import { COMPLAINT_STATUSES, STATUS_META } from '@/constants/status';

/**
 * Turns a complaint's history into Timeline items: what has happened, the current step,
 * and the stages still ahead (muted, undated).
 */
export function buildComplaintTimeline({ history, status }) {
  const happened = history.map((entry, index) => ({
    id: entry.id,
    title: entry.status === 'pending' ? 'Complaint submitted' : STATUS_META[entry.status].label,
    description: entry.description,
    actor: entry.actor,
    at: entry.at,
    state: index === history.length - 1 ? 'current' : 'done',
  }));
  const upcoming = COMPLAINT_STATUSES.slice(COMPLAINT_STATUSES.indexOf(status) + 1).map((stage) => ({
    id: `upcoming-${stage}`, title: STATUS_META[stage].label, state: 'upcoming',
  }));
  return [...happened, ...upcoming];
}
