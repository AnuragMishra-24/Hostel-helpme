import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ClipboardList } from 'lucide-react';
import AsyncBoundary from '@/components/common/AsyncBoundary';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import Card, { CardHeader } from '@/components/common/Card';
import DescriptionList from '@/components/common/DescriptionList';
import EmptyState from '@/components/common/EmptyState';
import PageHeader from '@/components/common/PageHeader';
import PriorityBadge from '@/components/common/PriorityBadge';
import StatusBadge from '@/components/common/StatusBadge';
import Timeline from '@/components/common/Timeline';
import AiSuggestionPanel from '@/components/complaints/AiSuggestionPanel';
import EvidenceGallery from '@/components/complaints/EvidenceGallery';
import { useAsync } from '@/hooks/useAsync';
import { complaintService } from '@/services/complaintService';
import { COMPLAINT_CATEGORIES } from '@/constants/complaints';
import { STUDENT_PATHS } from '@/constants/roles';
import { buildComplaintTimeline } from '@/utils/complaints';
import { formatDateTime, labelFor } from '@/utils/format';

const backAction = <Button as={Link} to={STUDENT_PATHS.complaints} variant="secondary" leftIcon={ArrowLeft}>Back to complaints</Button>;

function ComplaintDetail({ complaint }) {
  const technician = complaint.assignedTo;
  return (
    <>
      <PageHeader title={complaint.title} description={`${complaint.id} · Submitted ${formatDateTime(complaint.createdAt)}`} actions={backAction} />
      <div className="detail-layout">
        <div className="detail-layout__side stack">
          <Card>
            <CardHeader title="Status" />
            <DescriptionList
              items={[
                { label: 'Current status', value: <StatusBadge status={complaint.status} /> },
                { label: 'Priority', value: <PriorityBadge priority={complaint.priority} /> },
                { label: 'Category', value: labelFor(COMPLAINT_CATEGORIES, complaint.category) },
                { label: 'Location', value: `Block ${complaint.block} · Room ${complaint.roomNumber}` },
                { label: 'Submitted', value: formatDateTime(complaint.createdAt) },
                { label: 'Last updated', value: formatDateTime(complaint.updatedAt) },
              ]}
            />
            <p className="text-sm text-muted detail-note">
              {complaint.priorityStatus === 'suggested' ? 'Priority is an AI suggestion until the warden reviews it.' : 'Priority confirmed by the warden.'}
            </p>
          </Card>

          <Card>
            <CardHeader title="Assigned technician" />
            {technician ? (
              <DescriptionList
                items={[
                  { label: 'Name', value: technician.name },
                  { label: 'Contact', value: technician.contact ? <a href={`tel:${technician.contact}`}>{technician.contact}</a> : null },
                  { label: 'Notes', value: technician.notes, block: true },
                ]}
              />
            ) : (
              <p className="text-secondary">A technician has not been assigned yet.</p>
            )}
          </Card>

          {complaint.resolution && (
            <Card>
              <CardHeader title="Resolution" />
              <p>{complaint.resolution.summary}</p>
              <p className="text-sm text-muted detail-note">Resolved {formatDateTime(complaint.resolution.resolvedAt)}</p>
            </Card>
          )}
        </div>

        <div className="detail-layout__main stack">
          <Card>
            <CardHeader title="Description" />
            <p className="prewrap">{complaint.description}</p>
          </Card>
          <AiSuggestionPanel ai={complaint.ai} />
          <Card>
            <CardHeader title="Evidence" actions={complaint.evidence.length > 0 && <Badge>{complaint.evidence.length}</Badge>} />
            <EvidenceGallery evidence={complaint.evidence} />
          </Card>
          <Card>
            <CardHeader title="Status history" />
            <Timeline label="Complaint status history" items={buildComplaintTimeline(complaint)} />
          </Card>
        </div>
      </div>
    </>
  );
}

export default function ComplaintDetailPage() {
  const { id } = useParams();
  const state = useAsync(() => complaintService.getComplaint(id), [id]);

  if (state.error?.status === 404) {
    return (
      <>
        <PageHeader title="Complaint" actions={backAction} />
        <EmptyState bordered icon={ClipboardList} title="Complaint not found" description="It may have been removed, or it belongs to another resident." />
      </>
    );
  }
  return (
    <>
      {!state.data && <PageHeader title="Complaint" actions={backAction} />}
      <AsyncBoundary state={state} loadingLabel="Loading complaint…" errorTitle="Unable to load this complaint">
        {(complaint) => <ComplaintDetail complaint={complaint} />}
      </AsyncBoundary>
    </>
  );
}
