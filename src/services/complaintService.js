import { http } from './api';
import { ENDPOINTS } from './endpoints';
import { withMock } from './withMock';
import * as mock from '@/mock/complaints';
import * as uploads from '@/mock/uploads';

/**
 * Student complaint contract (all scoped to the signed-in student by the backend):
 *   getComplaints({ search, status, priority, category }) → { items: ComplaintListItem[], page, pageSize, total }
 *   getSummary()        → { pending, assigned, in_progress, resolved, closed, total }
 *   getComplaint(id)    → Complaint
 *   createComplaint({ title, description, category, block, roomNumber, evidence: EvidenceFile[] }) → Complaint
 *   uploadEvidence(file, { onProgress }) → EvidenceFile   // { id, name, type, size, url }
 *
 * Complaint: ComplaintListItem + { evidence, assignedTo: { name, contact, notes } | null,
 *   resolution: { summary, resolvedAt } | null, priorityStatus: 'suggested' | 'confirmed',
 *   ai: { suggestedCategory, suggestedPriority, priorityReason, simplifiedDescription } | null,
 *   history: [{ id, status, actor, description?, at }] }
 * `ai` is produced by the backend and is only a suggestion; the warden decides.
 */
export const complaintService = {
  getComplaints: (params) =>
    withMock(() => mock.getComplaints(params), () => http.get(ENDPOINTS.complaints.list, { params })),
  getSummary: () =>
    withMock(() => mock.getSummary(), () => http.get(ENDPOINTS.complaints.summary)),
  getComplaint: (id) =>
    withMock(() => mock.getComplaint(id), () => http.get(ENDPOINTS.complaints.detail(id))),
  createComplaint: (payload) =>
    withMock(() => mock.createComplaint(payload), () => http.post(ENDPOINTS.complaints.list, payload)),
  uploadEvidence: (file, options) =>
    withMock(
      () => uploads.uploadEvidence(file, options),
      () => {
        const form = new FormData();
        form.append('file', file);
        return http.upload(ENDPOINTS.complaints.evidence, form, options);
      },
    ),
};
