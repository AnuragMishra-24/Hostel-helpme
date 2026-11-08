import { Link } from 'react-router-dom';
import { Wallet } from 'lucide-react';
import AsyncBoundary from '@/components/common/AsyncBoundary';
import Card, { CardHeader } from '@/components/common/Card';
import DescriptionList from '@/components/common/DescriptionList';
import EmptyState from '@/components/common/EmptyState';
import StatusBadge from '@/components/common/StatusBadge';
import { useAsync } from '@/hooks/useAsync';
import { feeService } from '@/services/feeService';
import { ROOM_TYPES } from '@/constants/hostel';
import { STUDENT_PATHS } from '@/constants/roles';
import { labelFor } from '@/utils/format';
import SectionSkeleton from './SectionSkeleton';

export default function FeeSummary() {
  const state = useAsync(() => feeService.getMyFees(), []);
  return (
    <Card>
      <CardHeader title="Hostel fee" actions={<Link to={STUDENT_PATHS.fees}>Details</Link>} />
      <AsyncBoundary state={state} errorTitle="Unable to load fee status" skeleton={<SectionSkeleton />}>
        {(fee) => (fee ? (
          <DescriptionList
            items={[
              { label: 'Academic year', value: fee.academicYear },
              { label: 'Fee category', value: labelFor(ROOM_TYPES, fee.roomType) },
              { label: 'Status', value: <StatusBadge status={fee.status} /> },
            ]}
          />
        ) : (
          <EmptyState icon={Wallet} title="Fee details not available yet" description="They appear here once the hostel office has recorded them." />
        ))}
      </AsyncBoundary>
    </Card>
  );
}
