import ApiError from '@/services/ApiError';
import { EVIDENCE_RULES } from '@/constants/complaints';
import { delay } from './delay';

// Mock evidence upload: nothing leaves the browser. Images get a small thumbnail data URL so the
// detail page can show them after a refresh; videos are stored as metadata only (url: null).
function makeThumbnail(file) {
  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      const scale = Math.min(1, 480 / Math.max(image.width, image.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(objectUrl);
      resolve(canvas.toDataURL('image/jpeg', 0.7));
    };
    image.onerror = () => { URL.revokeObjectURL(objectUrl); resolve(null); };
    image.src = objectUrl;
  });
}

export async function uploadEvidence(file, { onProgress } = {}) {
  if (!(file.type in EVIDENCE_RULES.types) || file.size > EVIDENCE_RULES.maxSizeMB * 1024 * 1024) {
    throw new ApiError('This file type or size is not allowed.', { code: 'VALIDATION_ERROR', status: 400 });
  }
  for (let percent = 0; percent < 100; percent += 25) {
    onProgress?.(percent);
    await delay(120);
  }
  onProgress?.(100);
  return {
    id: `ev-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    name: file.name,
    type: file.type,
    size: file.size,
    url: file.type.startsWith('image/') ? await makeThumbnail(file) : null,
  };
}
