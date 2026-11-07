import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Trash2 } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import Card, { CardHeader } from '@/components/common/Card';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import StatusBadge from '@/components/common/StatusBadge';
import PriorityBadge from '@/components/common/PriorityBadge';
import Tabs from '@/components/common/Tabs';
import Table from '@/components/common/Table';
import SearchBar from '@/components/common/SearchBar';
import Dropdown from '@/components/common/Dropdown';
import Modal from '@/components/common/Modal';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import LoadingState, { Skeleton } from '@/components/common/LoadingState';
import Input from '@/components/forms/Input';
import Select from '@/components/forms/Select';
import Textarea from '@/components/forms/Textarea';
import { useToast } from '@/context/ToastContext';
import { useAsync } from '@/hooks/useAsync';
import { complaintService } from '@/services/complaintService';
import { COMPLAINT_STATUSES, PRIORITIES } from '@/constants/status';
import { BLOCKS } from '@/constants/hostel';
import { PATHS } from '@/constants/roles';
import { SHOWCASE_ROWS } from '@/mock/showcase';
import { formatDate } from '@/utils/format';

const TABLE_COLUMNS = [
  { key: 'reference', header: 'Reference' },
  { key: 'location', header: 'Location' },
  { key: 'category', header: 'Category' },
  { key: 'priority', header: 'Priority', render: (row) => <PriorityBadge priority={row.priority} /> },
  { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
  { key: 'updated', header: 'Updated', render: (row) => formatDate(row.updated) },
];

const TABS = [
  { value: 'all', label: 'All' },
  { value: 'open', label: 'Open' },
  { value: 'closed', label: 'Closed' },
];

function Section({ title, description, children }) {
  return (
    <Card className="showcase__section">
      <CardHeader title={title} description={description} />
      {children}
    </Card>
  );
}

/** Development-only preview of the design system. Not part of the product UI. */
export default function ComponentShowcase() {
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [simulateError, setSimulateError] = useState(false);

  // Exercises UI → service → (mock | API) end to end, including error + retry.
  const complaints = useAsync(() => complaintService.getComplaints({ simulateError }), [simulateError]);

  const confirmAction = () => {
    setConfirming(true);
    setTimeout(() => {
      setConfirming(false);
      setConfirmOpen(false);
      toast.success('Action confirmed.');
    }, 900);
  };

  const visibleRows = SHOWCASE_ROWS.filter((row) => {
    const matchesSearch = `${row.reference} ${row.location} ${row.category}`.toLowerCase().includes(search.toLowerCase());
    const isOpen = row.status !== 'resolved' && row.status !== 'closed';
    return matchesSearch && (tab === 'all' || (tab === 'open' ? isOpen : !isOpen));
  });

  return (
    <div className="page">
      <PageHeader
        title="Design system"
        description="Development preview of the shared components. This page is not included in production builds."
        actions={<Button as={Link} to={PATHS.LOGIN} variant="secondary">Back to sign in</Button>}
      />

      <div className="stack" style={{ '--stack-gap': 'var(--space-6)' }}>
        <Section title="Buttons">
          <div className="row">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger" leftIcon={Trash2}>Delete</Button>
            <Button leftIcon={Plus}>With icon</Button>
            <Button loading>Saving</Button>
            <Button disabled>Disabled</Button>
            <Button size="sm" variant="secondary">Small</Button>
          </div>
        </Section>

        <Section title="Badges" description="Status uses a dot and label; priority uses a plain label. Colour is never the only signal.">
          <div className="stack">
            <div className="row">{COMPLAINT_STATUSES.map((s) => <StatusBadge key={s} status={s} />)}<StatusBadge status="approved" /><StatusBadge status="rejected" /></div>
            <div className="row">{PRIORITIES.map((p) => <PriorityBadge key={p} priority={p} />)}<Badge variant="primary">Block B</Badge><Badge>Hostel-wide</Badge></div>
          </div>
        </Section>

        <Section title="Form controls">
          <div className="grid grid--2">
            <Input label="Title" placeholder="Short summary of the issue" required />
            <Select label="Block" placeholder="Select a block" options={BLOCKS.map((b) => ({ value: b, label: `Block ${b}` }))} />
            <Input label="Room number" hint="For example, 301." icon={Search} />
            <Input label="With error" defaultValue="abc" error="Enter a valid room number." />
            <div style={{ gridColumn: '1 / -1' }}>
              <Textarea label="Description" placeholder="Describe what is wrong and when it started." />
            </div>
            <Input label="Disabled" disabled defaultValue="Not editable" />
          </div>
        </Section>

        <Section title="Table, search and tabs" description="Under 720px each row becomes a labelled stack.">
          <div className="stack">
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <Tabs tabs={TABS} value={tab} onChange={setTab} label="Complaint filter" idPrefix="showcase" />
              <SearchBar value={search} onChange={setSearch} placeholder="Search sample rows" />
            </div>
            <div role="tabpanel" id={`showcase-panel-${tab}`} aria-labelledby={`showcase-tab-${tab}`}>
              <Table
                caption="Sample complaints"
                columns={TABLE_COLUMNS}
                rows={visibleRows}
                onRowClick={(row) => toast.info(`Opened ${row.reference}`)}
                emptyState={<EmptyState bordered icon={Search} title="No matching rows" description="Try a different search or filter." />}
              />
            </div>
          </div>
        </Section>

        <Section title="Feedback and overlays">
          <div className="row">
            <Button variant="secondary" onClick={() => toast.success('Changes saved.')}>Success toast</Button>
            <Button variant="secondary" onClick={() => toast.error('Unable to save changes.', { title: 'Save failed' })}>Error toast</Button>
            <Button variant="secondary" onClick={() => toast.warning('Your session will expire soon.')}>Warning toast</Button>
            <Button variant="secondary" onClick={() => setModalOpen(true)}>Open modal</Button>
            <Button variant="danger" onClick={() => setConfirmOpen(true)}>Confirmation dialog</Button>
            <Dropdown
              align="start"
              items={[{ label: 'View details' }, { label: 'Edit' }, { type: 'separator' }, { label: 'Delete', icon: Trash2, tone: 'danger' }]}
              renderTrigger={(props) => <Button variant="secondary" {...props}>Actions</Button>}
            />
          </div>
        </Section>

        <Section title="Loading, empty and error states">
          <div className="grid grid--2">
            <Card padded={false} className="state--bordered"><LoadingState label="Loading complaints…" /></Card>
            <Card padded={false}><EmptyState icon={Search} title="No complaints found" description="Complaints you raise will appear here." /></Card>
            <Card padded={false}><ErrorState title="Unable to load complaints" message="Check your connection and try again." onRetry={() => toast.info('Retrying…')} /></Card>
            <Card className="stack" style={{ '--stack-gap': 'var(--space-3)' }}>
              <Skeleton width="40%" height="1.25rem" />
              <Skeleton height="0.875rem" />
              <Skeleton width="85%" height="0.875rem" />
            </Card>
          </div>
        </Section>

        <Section title="Service layer" description="Fetched through complaintService, which uses the mock layer while VITE_USE_MOCK=true.">
          <div className="stack">
            <div className="row">
              <Button size="sm" variant="secondary" onClick={() => setSimulateError((v) => !v)}>
                {simulateError ? 'Request succeeds' : 'Simulate failed request'}
              </Button>
            </div>
            {complaints.loading && <LoadingState label="Loading complaints…" />}
            {complaints.error && <ErrorState title="Unable to load complaints" message={complaints.error.message} onRetry={complaints.reload} />}
            {!complaints.loading && !complaints.error && complaints.data?.items.length === 0 && (
              <EmptyState bordered icon={Search} title="No complaints found" description="The mock service returned an empty list." />
            )}
          </div>
        </Section>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Dialog title"
        description="Dialogs trap focus, close on Escape and restore focus when dismissed."
        footer={(
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={() => setModalOpen(false)}>Save changes</Button>
          </>
        )}
      >
        <Input label="Name" placeholder="Type something" />
      </Modal>

      <ConfirmationModal
        open={confirmOpen}
        title="Confirm this action?"
        message="This is how important or destructive actions will be confirmed."
        confirmLabel="Confirm"
        loading={confirming}
        onConfirm={confirmAction}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
