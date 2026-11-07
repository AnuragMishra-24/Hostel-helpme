import { useState } from 'react';
import { UserCheck } from 'lucide-react';
import Button from '@/components/common/Button';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import LoadingState from '@/components/common/LoadingState';
import PageHeader from '@/components/common/PageHeader';
import Table from '@/components/common/Table';
import { useToast } from '@/context/ToastContext';
import { useAsync } from '@/hooks/useAsync';
import { verificationService } from '@/services/verificationService';
import { formatDate } from '@/utils/format';

const CLOSED_DIALOG = { open: false, registration: null, decision: 'approved' };

/**
 * Minimal Phase 2 review screen: approve or reject pending student registrations.
 * Search, history and student management are built in the Warden module phase.
 */
export default function VerificationsPage() {
  const toast = useToast();
  const { data, error, loading, reload } = useAsync(() => verificationService.getRegistrations({ status: 'pending' }), []);
  const [dialog, setDialog] = useState(CLOSED_DIALOG);
  const [submitting, setSubmitting] = useState(false);

  const isApprove = dialog.decision === 'approved';
  const openDialog = (registration, decision) => setDialog({ open: true, registration, decision });
  const closeDialog = () => setDialog((prev) => ({ ...prev, open: false }));

  const confirm = async () => {
    setSubmitting(true);
    try {
      await verificationService.reviewRegistration(dialog.registration.id, dialog.decision);
      toast.success(`${dialog.registration.name} ${isApprove ? 'approved' : 'rejected'}.`);
      closeDialog();
      reload();
    } catch (apiError) {
      toast.error(apiError.message);
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { key: 'name', header: 'Student' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    { key: 'enrollmentNumber', header: 'Enrollment' },
    { key: 'createdAt', header: 'Submitted', render: (row) => formatDate(row.createdAt) },
    {
      key: 'actions',
      header: 'Decision',
      render: (row) => (
        <span className="row">
          <Button size="sm" onClick={() => openDialog(row, 'approved')} aria-label={`Approve ${row.name}`}>Approve</Button>
          <Button size="sm" variant="secondary" onClick={() => openDialog(row, 'rejected')} aria-label={`Reject ${row.name}`}>Reject</Button>
        </span>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="Verifications" description="Review new student registrations." />

      {loading && <LoadingState label="Loading registrations…" />}
      {error && <ErrorState title="Unable to load registrations" message={error.message} onRetry={reload} />}
      {!loading && !error && (
        <Table
          caption="Pending student registrations"
          columns={columns}
          rows={data.items}
          emptyState={(
            <EmptyState bordered icon={UserCheck} title="No pending registrations" description="New student registrations will appear here for review." />
          )}
        />
      )}

      <ConfirmationModal
        open={dialog.open}
        title={isApprove ? 'Approve this registration?' : 'Reject this registration?'}
        message={isApprove
          ? `${dialog.registration?.name} will be able to sign in and use Hostel HelpMe.`
          : `${dialog.registration?.name} will not be able to access Hostel HelpMe.`}
        confirmLabel={isApprove ? 'Approve' : 'Reject'}
        tone={isApprove ? 'primary' : 'danger'}
        loading={submitting}
        onConfirm={confirm}
        onCancel={closeDialog}
      />
    </>
  );
}
