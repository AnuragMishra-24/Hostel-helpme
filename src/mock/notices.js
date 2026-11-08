import { requireRole } from './users';
import { getAssignment } from './students';

const SEED = [
  { id: 'n1', title: 'Water supply maintenance on 9 November', content: 'Water supply will be interrupted in all blocks from 10:00 AM to 2:00 PM for tank cleaning. Please store water in advance.', scope: 'hostel', block: null, important: true, publishedAt: '2026-11-06T14:00:00Z' },
  { id: 'n2', title: 'Fire safety drill — Block B', content: 'A fire safety drill will be held in Block B on Monday at 5:30 PM. All residents must assemble at the front lawn when the alarm sounds.', scope: 'block', block: 'B', important: true, publishedAt: '2026-11-05T09:30:00Z' },
  { id: 'n3', title: 'Mess timings revised for Sundays', content: 'From this Sunday, breakfast will be served from 8:00 AM to 9:30 AM. Other meal timings are unchanged.', scope: 'hostel', block: null, important: false, publishedAt: '2026-11-03T18:00:00Z' },
  { id: 'n4', title: 'Lift maintenance — Block A', content: 'The Block A lift will be out of service on Wednesday for maintenance.', scope: 'block', block: 'A', important: false, publishedAt: '2026-11-02T11:00:00Z' },
  { id: 'n5', title: 'Corridor lights replaced — Block B', content: 'Corridor lighting on all floors of Block B has been upgraded. Report any non-working lights through the complaints section.', scope: 'block', block: 'B', important: false, publishedAt: '2026-10-28T10:15:00Z' },
  { id: 'n6', title: 'Hostel fee schedule for 2026–27', content: 'The fee schedule for the current academic year is available from the hostel office. Fee status is shown on the Fees page.', scope: 'hostel', block: null, important: false, publishedAt: '2026-10-15T09:00:00Z' },
];

// Students see hostel-wide notices plus those for their own block (the backend applies the same rule).
export function getNotices({ limit } = {}) {
  const user = requireRole('student');
  const block = getAssignment(user.id)?.block;
  const items = SEED
    .filter((notice) => notice.scope === 'hostel' || notice.block === block)
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  const page = limit ? items.slice(0, limit) : items;
  return { items: page, page: 1, pageSize: page.length, total: items.length };
}
