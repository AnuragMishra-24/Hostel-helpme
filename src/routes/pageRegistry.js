import VerificationsPage from '@/pages/warden/VerificationsPage';
import ComplaintDetailPage from '@/pages/student/ComplaintDetailPage';
import ComplaintsPage from '@/pages/student/ComplaintsPage';
import DashboardPage from '@/pages/student/DashboardPage';
import FeesPage from '@/pages/student/FeesPage';
import MessPage from '@/pages/student/MessPage';
import NewComplaintPage from '@/pages/student/NewComplaintPage';
import NoticesPage from '@/pages/student/NoticesPage';
import ProfilePage from '@/pages/student/ProfilePage';
import RoomRequestPage from '@/pages/student/RoomRequestPage';
import RulesPage from '@/pages/student/RulesPage';

// Real pages by role and nav key. Any nav item without an entry renders the shared PlaceholderPage.
export const PAGE_REGISTRY = {
  student: {
    dashboard: DashboardPage,
    complaints: ComplaintsPage,
    'room-request': RoomRequestPage,
    notices: NoticesPage,
    fees: FeesPage,
    mess: MessPage,
    rules: RulesPage,
    profile: ProfilePage,
  },
  warden: { verifications: VerificationsPage },
  admin: {},
};

// Routes below a role's base path that are not sidebar items (detail and create screens).
export const EXTRA_PAGES = {
  student: [
    { path: 'complaints/new', Page: NewComplaintPage },
    { path: 'complaints/:id', Page: ComplaintDetailPage },
  ],
};
