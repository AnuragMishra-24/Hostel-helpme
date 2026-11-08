import { useState } from 'react';
import { Megaphone } from 'lucide-react';
import AsyncBoundary from '@/components/common/AsyncBoundary';
import Card from '@/components/common/Card';
import EmptyState from '@/components/common/EmptyState';
import PageHeader from '@/components/common/PageHeader';
import Tabs from '@/components/common/Tabs';
import NoticeItem from '@/components/notices/NoticeItem';
import { useAsync } from '@/hooks/useAsync';
import { noticeService } from '@/services/noticeService';
import { NOTICE_SCOPE_FILTERS } from '@/constants/hostel';

export default function NoticesPage() {
  const [scope, setScope] = useState('all');
  const state = useAsync(() => noticeService.getNotices(), []);

  return (
    <>
      <PageHeader title="Notices" description="Announcements for the whole hostel and for your block." />
      <div className="stack">
        <Tabs tabs={NOTICE_SCOPE_FILTERS} value={scope} onChange={setScope} label="Notice audience" idPrefix="notices" />
        <div role="tabpanel" id={`notices-panel-${scope}`} aria-labelledby={`notices-tab-${scope}`}>
          <AsyncBoundary state={state} loadingLabel="Loading notices…" errorTitle="Unable to load notices">
            {({ items }) => {
              const visible = scope === 'all' ? items : items.filter((notice) => notice.scope === scope);
              return visible.length === 0 ? (
                <EmptyState bordered icon={Megaphone} title="No notices available" description="Announcements from the warden will appear here." />
              ) : (
                <Card className="notice-list" padded={false}>
                  {visible.map((notice) => <NoticeItem key={notice.id} notice={notice} />)}
                </Card>
              );
            }}
          </AsyncBoundary>
        </div>
      </div>
    </>
  );
}
