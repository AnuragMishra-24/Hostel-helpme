import ApiError from '@/services/ApiError';

// Seed data is added in Phase 3. `simulateError` lets the design-system
// preview exercise the error/retry path through the real service pipeline.
export function getComplaints(params = {}) {
  if (params.simulateError) {
    throw new ApiError('Unable to load complaints.', { code: 'SERVER_ERROR', status: 500 });
  }
  return { items: [], page: 1, pageSize: 10, total: 0 };
}
