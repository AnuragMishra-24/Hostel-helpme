export const BLOCKS = ['A', 'B', 'C', 'D'];

export const ROOM_TYPES = [
  { value: 'ac_single', label: 'AC Single' },
  { value: 'ac_double', label: 'AC Double' },
  { value: 'ac_quad', label: 'AC Quad' },
];

export const ROOM_CHANGE_REASONS = [
  { value: 'roommate_conflict', label: 'Roommate conflict' },
  { value: 'medical', label: 'Medical reasons' },
  { value: 'room_condition', label: 'Room condition' },
  { value: 'academic', label: 'Academic requirements' },
  { value: 'other', label: 'Other' },
];

// Student-facing explanation of each room-request status.
export const ROOM_REQUEST_STATUS_TEXT = Object.freeze({
  pending: 'Your request has been submitted and is waiting for the warden.',
  under_review: 'The warden is reviewing your request and checking room availability.',
  approved: 'Your request was approved. The warden will confirm your new room allocation.',
  rejected: 'Your request was not approved. See the warden’s note for details.',
});

export const MEALS = [
  { key: 'breakfast', label: 'Breakfast' },
  { key: 'lunch', label: 'Lunch' },
  { key: 'snacks', label: 'Evening snacks' },
  { key: 'dinner', label: 'Dinner' },
];

export const WEEKDAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export const NOTICE_SCOPE_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'hostel', label: 'Hostel-wide' },
  { value: 'block', label: 'My block' },
];
