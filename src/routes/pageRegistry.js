import VerificationsPage from '@/pages/warden/VerificationsPage';

// Later phases register real pages here, keyed by role and nav key, e.g.
//   student: { complaints: StudentComplaintsPage }
// Any nav item without an entry renders the shared PlaceholderPage.
export const PAGE_REGISTRY = {
  student: {},
  warden: { verifications: VerificationsPage },
  admin: {},
};
