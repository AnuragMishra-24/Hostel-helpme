export const COMPLAINT_CATEGORIES = [
  { value: 'electrical', label: 'Electrical' },
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'furniture', label: 'Furniture' },
  { value: 'cleaning', label: 'Cleaning' },
  { value: 'internet', label: 'Internet / Wi-Fi' },
  { value: 'other', label: 'Other' },
];

export const TITLE_MIN_LENGTH = 5;
export const TITLE_MAX_LENGTH = 100;
export const DESCRIPTION_MIN_LENGTH = 10;
export const DESCRIPTION_MAX_WORDS = 500;

export const EVIDENCE_RULES = Object.freeze({
  maxFiles: 3,
  maxSizeMB: 20,
  types: {
    'image/jpeg': 'JPG',
    'image/png': 'PNG',
    'image/webp': 'WebP',
    'video/mp4': 'MP4',
    'video/webm': 'WebM',
  },
});
