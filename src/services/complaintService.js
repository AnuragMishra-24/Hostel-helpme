import { http } from './api';
import { ENDPOINTS } from './endpoints';
import { withMock } from './withMock';
import * as mock from '@/mock/complaints';

// Phase 1: a single read method establishes the pattern. Methods are added
// in the phase that builds the matching module.
export const complaintService = {
  getComplaints: (params) =>
    withMock(
      () => mock.getComplaints(params),
      () => http.get(ENDPOINTS.complaints.list, { params }),
    ),
};
