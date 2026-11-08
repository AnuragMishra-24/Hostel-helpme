import { Link } from 'react-router-dom';
import { Megaphone } from 'lucide-react';
import AsyncBoundary from '@/components/common/AsyncBoundary';
import Card, { CardHeader } from '@/components/common/Card';
import EmptyState from '@/components/common/EmptyState';
import NoticeItem from '@/components/notices/NoticeItem';
import { useAsync } from '@/hooks/useAsync';
import { noticeService } from '@/services/noticeService';
import { STUDENT_PATHS } from '@/constants/roles';
import SectionSkeleton from './SectionSkeleton';

const RECENT_COUNT = 3;

export default function RecentNotices() {
  const state = useAsync(() => noticeService.getNotices({ limit: RECENT_COUNT }), []);
  return (
    <Card>
      <CardHeader title="Recent notices" actions={<Link to={STUDENT_PATHS.notices}>View all</Link>} />
      <AsyncBoundary state={state} errorTitle="Unable to load notices" skeleton={<SectionSkeleton lines={4} />}>
        {({ items }) => (items.length === 0 ? (
          <EmptyState icon={Megaphone} title="No notices available" description="Announcements from the warden will appear here." />
        ) : (
          <div className="notice-list">{items.map((notice) => <NoticeItem key={notice.id} notice={notice} compact />)}</div>
        ))}
      </AsyncBoundary>
    </Card>
  );
}
