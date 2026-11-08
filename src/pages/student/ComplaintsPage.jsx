import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ClipboardList, Plus, SearchX } from 'lucide-react';
import AsyncBoundary from '@/components/common/AsyncBoundary';
import Button from '@/components/common/Button';
import EmptyState from '@/components/common/EmptyState';
import PageHeader from '@/components/common/PageHeader';
import PriorityBadge from '@/components/common/PriorityBadge';
import StatusBadge from '@/components/common/StatusBadge';
import Table from '@/components/common/Table';
import ComplaintFilters from '@/components/complaints/ComplaintFilters';
import { useAsync } from '@/hooks/useAsync';
import { useDebounce } from '@/hooks/useDebounce';
import { complaintService } from '@/services/complaintService';
import { COMPLAINT_CATEGORIES } from '@/constants/complaints';
import { COMPLAINT_STATUSES } from '@/constants/status';
import { STUDENT_PATHS } from '@/constants/roles';
import { formatDate, labelFor } from '@/utils/format';

const NO_FILTERS = { search: '', status: '', priority: '', category: '' };

export default function ComplaintsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialStatus = searchParams.get('status');
  const [filters, setFilters] = useState({
    ...NO_FILTERS,
    status: COMPLAINT_STATUSES.includes(initialStatus) ? initialStatus : '',
  });
  const debouncedSearch = useDebounce(filters.search, 300);
  const search = filters.search ? debouncedSearch : ''; // clearing the box applies immediately
  const filtersActive = Object.values(filters).some(Boolean);

  const state = useAsync(
    () => complaintService.getComplaints({ ...filters, search }),
    [search, filters.status, filters.priority, filters.category],
  );

  const columns = [
    {
      key: 'title',
      header: 'Complaint',
      primary: true,
      render: (row) => (
        <>
          <Link to={STUDENT_PATHS.complaint(row.id)} className="table__link">{row.title}</Link>
          <span className="table__sub">{row.id} · {row.description}</span>
        </>
      ),
    },
    { key: 'category', header: 'Category', render: (row) => labelFor(COMPLAINT_CATEGORIES, row.category) },
    { key: 'location', header: 'Location', render: (row) => `Block ${row.block} · ${row.roomNumber}` },
    { key: 'priority', header: 'Priority', render: (row) => <PriorityBadge priority={row.priority} /> },
    { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    { key: 'updatedAt', header: 'Updated', render: (row) => formatDate(row.updatedAt) },
  ];

  return (
    <>
      <PageHeader
        title="Complaints"
        description="Report hostel issues and track their progress."
        actions={<Button as={Link} to={STUDENT_PATHS.newComplaint} leftIcon={Plus}>New complaint</Button>}
      />
      <div className="stack">
        <ComplaintFilters filters={filters} onChange={setFilters} onClear={() => setFilters(NO_FILTERS)} active={filtersActive} />
        <div aria-busy={state.loading} className={state.loading && state.data ? 'is-refreshing' : undefined}>
          <AsyncBoundary state={state} loadingLabel="Loading complaints…" errorTitle="Unable to load complaints">
            {({ items }) => {
              if (items.length > 0) {
                return <Table caption="Your complaints" columns={columns} rows={items} onRowClick={(row) => navigate(STUDENT_PATHS.complaint(row.id))} />;
              }
              return filtersActive ? (
                <EmptyState
                  bordered
                  icon={SearchX}
                  title="No complaints match your filters"
                  description="Try a different search or clear the filters."
                  action={<Button variant="secondary" onClick={() => setFilters(NO_FILTERS)}>Clear filters</Button>}
                />
              ) : (
                <EmptyState
                  bordered
                  icon={ClipboardList}
                  title="No complaints yet"
                  description="When you report a problem, you can follow its progress here."
                  action={<Button as={Link} to={STUDENT_PATHS.newComplaint} leftIcon={Plus}>Raise complaint</Button>}
                />
              );
            }}
          </AsyncBoundary>
        </div>
      </div>
    </>
  );
}
