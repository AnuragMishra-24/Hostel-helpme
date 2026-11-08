import PageHeader from '@/components/common/PageHeader';
import ComplaintSummary from '@/components/dashboard/ComplaintSummary';
import FeeSummary from '@/components/dashboard/FeeSummary';
import QuickActions from '@/components/dashboard/QuickActions';
import RecentNotices from '@/components/dashboard/RecentNotices';
import RoomOverview from '@/components/dashboard/RoomOverview';
import RoomRequestSummary from '@/components/dashboard/RoomRequestSummary';
import { useAsync } from '@/hooks/useAsync';
import { useAuth } from '@/hooks/useAuth';
import { studentService } from '@/services/studentService';

/** Each card loads independently, so one slow or failing section never blanks the page. */
export default function DashboardPage() {
  const { user } = useAuth();
  const profile = useAsync(() => studentService.getProfile(), []);
  const hostel = profile.data?.hostel;

  return (
    <>
      <PageHeader
        title={`Welcome, ${user.name.split(' ')[0]}`}
        description={hostel ? `Block ${hostel.block} · Room ${hostel.roomNumber}` : 'Here is your hostel at a glance.'}
      />
      <div className="stack" style={{ '--stack-gap': 'var(--space-5)' }}>
        <QuickActions />
        <div className="grid grid--2">
          <ComplaintSummary />
          <RoomOverview state={profile} />
          <RoomRequestSummary />
          <FeeSummary />
        </div>
        <RecentNotices />
      </div>
    </>
  );
}
