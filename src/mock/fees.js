import { requireRole } from './users';

// Display-only. Amounts are recorded by the hostel office; there is no payment flow.
const FEES = {
  'u-student': {
    academicYear: '2026–27', roomType: 'ac_double', totalAmount: 145000, paidAmount: 100000,
    remainingAmount: 45000, status: 'partial', lastPaymentAt: '2026-08-12T10:42:00Z',
  },
};

export function getMyFees() {
  const user = requireRole('student');
  return FEES[user.id] ?? null;
}
