import ApiError from '@/services/ApiError';
import { analyzeComplaint } from './ai';
import { createCollection } from './storage';
import { requireRole } from './users';

const STUDENT = 'u-student';
const placeholder = (label) => `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="320"><rect width="480" height="320" fill="#e2e8f0"/><text x="240" y="165" font-family="sans-serif" font-size="20" fill="#475569" text-anchor="middle">${label}</text></svg>`,
)}`;

const SEED = [
  {
    id: 'CMP-1042', studentId: STUDENT, title: 'Switchboard sparking near bed', category: 'electrical', block: 'B', roomNumber: '301',
    description: 'The switchboard next to my bed sparks every time I plug in my laptop charger. There is a burning smell and the socket feels warm. I have stopped using it but my roommate is worried.',
    status: 'in_progress', priority: 'critical', priorityStatus: 'confirmed',
    ai: { suggestedCategory: 'electrical', suggestedPriority: 'critical', priorityReason: 'Potential electrical or fire safety hazard.', simplifiedDescription: 'Switchboard sparks when a charger is plugged in and smells of burning.' },
    evidence: [{ id: 'ev-1', name: 'switchboard.jpg', type: 'image/jpeg', size: 842000, url: placeholder('switchboard.jpg') }],
    assignedTo: { name: 'Ramesh Electricals', contact: '9810022334', notes: 'Visit scheduled for 8 Nov, 10:00 AM. Please keep the socket switched off.' },
    resolution: null, createdAt: '2026-11-05T09:12:00Z', updatedAt: '2026-11-06T10:05:00Z',
    history: [
      { id: 'h1', status: 'pending', actor: 'Student', at: '2026-11-05T09:12:00Z' },
      { id: 'h2', status: 'assigned', actor: 'Warden', description: 'Assigned to Ramesh Electricals.', at: '2026-11-05T11:40:00Z' },
      { id: 'h3', status: 'in_progress', actor: 'Warden', description: 'Technician has started work.', at: '2026-11-06T10:05:00Z' },
    ],
  },
  {
    id: 'CMP-1038', studentId: STUDENT, title: 'Tap leaking in bathroom', category: 'plumbing', block: 'B', roomNumber: '301',
    description: 'The bathroom tap keeps dripping even when fully closed. The floor stays wet through the night.',
    status: 'assigned', priority: 'high', priorityStatus: 'confirmed',
    ai: { suggestedCategory: 'plumbing', suggestedPriority: 'high', priorityReason: 'Ongoing water loss can damage the room.', simplifiedDescription: 'Bathroom tap drips continuously and keeps the floor wet.' },
    evidence: [], assignedTo: { name: 'City Plumbing Works', contact: '9810055120', notes: '' },
    resolution: null, createdAt: '2026-11-03T18:30:00Z', updatedAt: '2026-11-04T09:15:00Z',
    history: [
      { id: 'h1', status: 'pending', actor: 'Student', at: '2026-11-03T18:30:00Z' },
      { id: 'h2', status: 'assigned', actor: 'Warden', description: 'Assigned to City Plumbing Works.', at: '2026-11-04T09:15:00Z' },
    ],
  },
  {
    id: 'CMP-1031', studentId: STUDENT, title: 'Wardrobe door hinge broken', category: 'furniture', block: 'B', roomNumber: '301',
    description: 'The top hinge of my wardrobe door has come off, so the door hangs loose and will not close.',
    status: 'pending', priority: 'medium', priorityStatus: 'suggested',
    ai: { suggestedCategory: 'furniture', suggestedPriority: 'medium', priorityReason: 'Affects daily use of the room.', simplifiedDescription: 'Wardrobe door hinge is broken and the door will not close.' },
    evidence: [], assignedTo: null, resolution: null, createdAt: '2026-11-02T08:05:00Z', updatedAt: '2026-11-02T08:05:00Z',
    history: [{ id: 'h1', status: 'pending', actor: 'Student', at: '2026-11-02T08:05:00Z' }],
  },
  {
    id: 'CMP-1019', studentId: STUDENT, title: 'Room not cleaned after maintenance', category: 'cleaning', block: 'B', roomNumber: '301',
    description: 'After the ceiling repair, the room was left covered in dust and plaster pieces.',
    status: 'resolved', priority: 'low', priorityStatus: 'confirmed',
    ai: { suggestedCategory: 'cleaning', suggestedPriority: 'low', priorityReason: 'Comfort issue with no safety impact.', simplifiedDescription: 'Room left dusty after ceiling repair.' },
    evidence: [], assignedTo: { name: 'Hostel housekeeping', contact: '', notes: '' },
    resolution: { summary: 'Room cleaned by housekeeping on 24 Oct.', resolvedAt: '2026-10-24T15:20:00Z' },
    createdAt: '2026-10-22T12:00:00Z', updatedAt: '2026-10-24T15:20:00Z',
    history: [
      { id: 'h1', status: 'pending', actor: 'Student', at: '2026-10-22T12:00:00Z' },
      { id: 'h2', status: 'assigned', actor: 'Warden', description: 'Assigned to housekeeping.', at: '2026-10-23T09:00:00Z' },
      { id: 'h3', status: 'resolved', actor: 'Warden', description: 'Room cleaned.', at: '2026-10-24T15:20:00Z' },
    ],
  },
  {
    id: 'CMP-1004', studentId: STUDENT, title: 'Wi-Fi not working in room', category: 'internet', block: 'B', roomNumber: '301',
    description: 'There has been no Wi-Fi signal in my room for two days, although it works in the corridor.',
    status: 'closed', priority: 'medium', priorityStatus: 'confirmed',
    ai: { suggestedCategory: 'internet', suggestedPriority: 'medium', priorityReason: 'Affects studies but is not a safety issue.', simplifiedDescription: 'No Wi-Fi signal in the room for two days.' },
    evidence: [], assignedTo: { name: 'Campus network team', contact: '', notes: '' },
    resolution: { summary: 'Access point replaced on the third floor.', resolvedAt: '2026-10-12T11:00:00Z' },
    createdAt: '2026-10-09T20:10:00Z', updatedAt: '2026-10-14T09:00:00Z',
    history: [
      { id: 'h1', status: 'pending', actor: 'Student', at: '2026-10-09T20:10:00Z' },
      { id: 'h2', status: 'assigned', actor: 'Warden', description: 'Assigned to the campus network team.', at: '2026-10-10T09:30:00Z' },
      { id: 'h3', status: 'resolved', actor: 'Warden', description: 'Access point replaced.', at: '2026-10-12T11:00:00Z' },
      { id: 'h4', status: 'closed', actor: 'System', description: 'Closed after no further reports.', at: '2026-10-14T09:00:00Z' },
    ],
  },
];

const store = createCollection('hostel-helpme.mock.complaints', SEED);

// Students only ever see their own complaints (the real backend enforces the same).
const mine = () => {
  const user = requireRole('student');
  return store.read().filter((complaint) => complaint.studentId === user.id);
};

// The student list view omits history/evidence detail the same way a real list endpoint would.
const toListItem = ({ id, title, description, category, block, roomNumber, status, priority, createdAt, updatedAt }) => ({
  id, title, description, category, block, roomNumber, status, priority, createdAt, updatedAt,
});

export function getComplaints({ search, status, priority, category, simulateError } = {}) {
  if (simulateError) throw new ApiError('Unable to load complaints.', { code: 'SERVER_ERROR', status: 500 });
  const term = search?.trim().toLowerCase();
  const items = mine()
    .filter((c) => (!status || c.status === status)
      && (!priority || c.priority === priority)
      && (!category || c.category === category)
      && (!term || `${c.title} ${c.description} ${c.id}`.toLowerCase().includes(term)))
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .map(toListItem);
  return { items, page: 1, pageSize: items.length, total: items.length };
}

export function getSummary() {
  const counts = { pending: 0, assigned: 0, in_progress: 0, resolved: 0, closed: 0 };
  const items = mine();
  items.forEach((c) => { counts[c.status] += 1; });
  return { ...counts, total: items.length };
}

export function getComplaint(id) {
  const complaint = mine().find((c) => c.id === id);
  if (!complaint) throw new ApiError('Complaint not found.', { code: 'NOT_FOUND', status: 404 });
  const { studentId, ...detail } = complaint;
  return detail;
}

export function createComplaint({ title, description, category, block, roomNumber, evidence = [] }) {
  const user = requireRole('student');
  if (!title?.trim() || !description?.trim() || !category || !block || !roomNumber?.trim()) {
    throw new ApiError('Fill in all required fields.', { code: 'VALIDATION_ERROR', status: 400 });
  }
  const all = store.read();
  const number = Math.max(1000, ...all.map((c) => Number(c.id.split('-')[1]))) + 1;
  const ai = analyzeComplaint({ title, description, category });
  const now = new Date().toISOString();
  const complaint = {
    id: `CMP-${number}`, studentId: user.id, title: title.trim(), description: description.trim(), category,
    block, roomNumber: roomNumber.trim(), status: 'pending', priority: ai.suggestedPriority, priorityStatus: 'suggested',
    ai, evidence, assignedTo: null, resolution: null, createdAt: now, updatedAt: now,
    history: [{ id: 'h1', status: 'pending', actor: 'Student', at: now }],
  };
  store.write([...all, complaint]);
  return getComplaint(complaint.id);
}
