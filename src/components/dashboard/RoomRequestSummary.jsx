import { Link } from 'react-router-dom';
import { DoorOpen } from 'lucide-react';
import AsyncBoundary from '@/components/common/AsyncBoundary';
import Button from '@/components/common/Button';
import Card, { CardHeader } from '@/components/common/Card';
import EmptyState from '@/components/common/EmptyState';
import StatusBadge from '@/components/common/StatusBadge';
import { useAsync } from '@/hooks/useAsync';
import { roomRequestService } from '@/services/roomRequestService';
import { ROOM_REQUEST_STATUS_TEXT } from '@/constants/hostel';
import { STUDENT_PATHS } from '@/constants/roles';
import { formatDate } from '@/utils/format';
import SectionSkeleton from './SectionSkeleton';

export default function RoomRequestSummary() {
  const state = useAsync(() => roomRequestService.getRequests(), []);
  return (
    <Card>
      <CardHeader title="Room change request" actions={<Link to={STUDENT_PATHS.roomRequest}>Details</Link>} />
      <AsyncBoundary state={state} errorTitle="Unable to load your request" skeleton={<SectionSkeleton />}>
        {({ items }) => (items.length === 0 ? (
          <EmptyState
            icon={DoorOpen}
            title="No room-change requests"
            description="Ask the warden to consider a room change."
            action={<Button as={Link} to={STUDENT_PATHS.roomRequest}>Request room change</Button>}
          />
        ) : (
          <div className="stack" style={{ '--stack-gap': 'var(--space-3)' }}>
            <div className="row"><StatusBadge status={items[0].status} /><span className="text-sm text-muted">Submitted {formatDate(items[0].createdAt)}</span></div>
            <p className="text-secondary">{ROOM_REQUEST_STATUS_TEXT[items[0].status]}</p>
          </div>
        ))}
      </AsyncBoundary>
    </Card>
  );
}
