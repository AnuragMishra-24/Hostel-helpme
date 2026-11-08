import { Wallet } from 'lucide-react';
import Alert from '@/components/common/Alert';
import AsyncBoundary from '@/components/common/AsyncBoundary';
import Card, { CardHeader } from '@/components/common/Card';
import DescriptionList from '@/components/common/DescriptionList';
import EmptyState from '@/components/common/EmptyState';
import PageHeader from '@/components/common/PageHeader';
import StatusBadge from '@/components/common/StatusBadge';
import { useAsync } from '@/hooks/useAsync';
import { feeService } from '@/services/feeService';
import { ROOM_TYPES } from '@/constants/hostel';
import { formatCurrency, formatDateTime, labelFor } from '@/utils/format';

/** Display-only. There is deliberately no payment action anywhere in this module. */
export default function FeesPage() {
  const state = useAsync(() => feeService.getMyFees(), []);

  return (
    <>
      <PageHeader title="Fees" description="Your hostel fee status for the current academic year." />
      <AsyncBoundary state={state} loadingLabel="Loading fee details…" errorTitle="Unable to load fee details">
        {(fee) => (fee ? (
          <div className="stack" style={{ '--stack-gap': 'var(--space-5)' }}>
            <Card>
              <CardHeader title={`Academic year ${fee.academicYear}`} actions={<StatusBadge status={fee.status} />} />
              <div className="figures">
                <div className="figure"><span className="figure__label">Total fee</span><span className="figure__value">{formatCurrency(fee.totalAmount)}</span></div>
                <div className="figure"><span className="figure__label">Paid</span><span className="figure__value">{formatCurrency(fee.paidAmount)}</span></div>
                <div className="figure"><span className="figure__label">Remaining</span><span className="figure__value">{formatCurrency(fee.remainingAmount)}</span></div>
              </div>
              <DescriptionList
                items={[
                  { label: 'Fee category', value: labelFor(ROOM_TYPES, fee.roomType) },
                  { label: 'Last payment recorded', value: formatDateTime(fee.lastPaymentAt) },
                ]}
              />
            </Card>
            <Alert variant="info">Fees are recorded by the hostel office. Online payment is not available in Hostel HelpMe.</Alert>
          </div>
        ) : (
          <EmptyState bordered icon={Wallet} title="Fee details not available yet" description="They will appear here once the hostel office has recorded them for you." />
        ))}
      </AsyncBoundary>
    </>
  );
}
