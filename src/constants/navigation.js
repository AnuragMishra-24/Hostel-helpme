import {
  BedDouble, BookOpen, CalendarRange, ClipboardList, DoorOpen, LayoutDashboard, Megaphone,
  Settings, User, UserCheck, Users, Utensils, Wallet,
} from 'lucide-react';

// Role-aware navigation. This is the single source for both the sidebar and
// the route table, so a nav item and its route can never drift apart.
// UI hiding is for UX only — authorization is enforced by the backend.
const item = (role, key, label, icon, description) => ({
  key, label, icon, description, path: `/${role}/${key}`,
});

export const NAV_BY_ROLE = Object.freeze({
  student: [
    item('student', 'dashboard', 'Dashboard', LayoutDashboard, 'Your room, complaints, notices and fees at a glance.'),
    item('student', 'complaints', 'Complaints', ClipboardList, 'Report hostel issues and track their progress.'),
    item('student', 'room-request', 'Room Request', DoorOpen, 'Request a room change and follow its status.'),
    item('student', 'notices', 'Notices', Megaphone, 'Announcements from your warden.'),
    item('student', 'fees', 'Fees', Wallet, 'Your hostel fee status.'),
    item('student', 'mess', 'Mess', Utensils, 'Mess menu and meal timings.'),
    item('student', 'rules', 'Rules', BookOpen, 'Official hostel rules and guidelines.'),
    item('student', 'profile', 'Profile', User, 'Your account and hostel details.'),
  ],
  warden: [
    item('warden', 'dashboard', 'Dashboard', LayoutDashboard, 'Pending work and hostel status.'),
    item('warden', 'verifications', 'Verifications', UserCheck, 'Review new student registrations.'),
    item('warden', 'students', 'Students', Users, 'Students registered in your hostel.'),
    item('warden', 'complaints', 'Complaints', ClipboardList, 'Review, assign and resolve complaints.'),
    item('warden', 'rooms', 'Rooms', BedDouble, 'Room occupancy and available beds.'),
    item('warden', 'room-requests', 'Room Requests', DoorOpen, 'Review room-change requests.'),
    item('warden', 'notices', 'Notices', Megaphone, 'Publish hostel and block notices.'),
    item('warden', 'mess', 'Mess', Utensils, 'Update the mess menu and timings.'),
    item('warden', 'profile', 'Profile', User, 'Your account details.'),
  ],
  admin: [
    item('admin', 'dashboard', 'Dashboard', LayoutDashboard, 'Hostel configuration overview.'),
    item('admin', 'fees', 'Fee Configuration', Wallet, 'Hostel fee structure by room type.'),
    item('admin', 'academic-year', 'Academic Year', CalendarRange, 'Set the active academic year.'),
    item('admin', 'settings', 'Hostel Settings', Settings, 'Hostel-level configuration.'),
    item('admin', 'profile', 'Profile', User, 'Your account details.'),
  ],
});
