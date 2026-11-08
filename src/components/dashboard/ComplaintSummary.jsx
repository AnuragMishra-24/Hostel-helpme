import { Link } from 'react-router-dom';
import { ClipboardList, Plus } from 'lucide-react';
import AsyncBoundary from '@/components/common/AsyncBoundary';
import Button from '@/components/common/Button';
import Card, { CardHeader } from '@/components/common/Card';
import EmptyState from '@/components/common/EmptyState';
import { useAsync } from '@/hooks/useAsync';
import { complaintService } from '@/services/complaintService';
import { STATUS_META } from '@/constants/status';
import { STUDENT_PATHS } from '@/constants/roles';
import SectionSkeleton from './SectionSkeleton';

const TILES = ['pending', 'assigned', 'in_progress', 'resolved'];

export default function ComplaintSummary() {
  const state = useAsync(() => complaintService.getSummary(), []);
  return (
    <Card>
      <CardHeader title="Your complaints" actions={<Link to={STUDENT_PATHS.complaints}>View all</Link>} />
      <AsyncBoundary state={state} errorTitle="Unable to load complaints" skeleton={<SectionSkeleton />}>
        {(summary) => (summary.total === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No complaints yet"
            description="Report a problem with your room or hostel and track it here."
            action={<Button as={Link} to={STUDENT_PATHS.newComplaint} leftIcon={Plus}>Raise complaint</Button>}
          />
        ) : (
          <ul className="stat-grid">
            {TILES.map((status) => (
              <li key={status}>
                <Link className="stat" to={`${STUDENT_PATHS.complaints}?status=${status}`}>
                  <span className="stat__value">{summary[status]}</span>
                  <span className="stat__label">{STATUS_META[status].label}</span>
                </Link>
              </li>
            ))}
          </ul>
        ))}
      </AsyncBoundary>
    </Card>
  );
}
