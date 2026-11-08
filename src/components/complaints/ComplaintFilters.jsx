import { X } from 'lucide-react';
import Button from '@/components/common/Button';
import SearchBar from '@/components/common/SearchBar';
import Select from '@/components/forms/Select';
import { COMPLAINT_CATEGORIES } from '@/constants/complaints';
import { COMPLAINT_STATUSES, PRIORITIES, PRIORITY_META, STATUS_META } from '@/constants/status';

const STATUS_OPTIONS = COMPLAINT_STATUSES.map((value) => ({ value, label: STATUS_META[value].label }));
const PRIORITY_OPTIONS = PRIORITIES.map((value) => ({ value, label: PRIORITY_META[value].label }));

/** Controlled filter bar: filters = { search, status, priority, category }. */
export default function ComplaintFilters({ filters, onChange, onClear, active }) {
  const set = (key) => (event) => onChange({ ...filters, [key]: event.target.value });
  return (
    <div className="filters" role="group" aria-label="Filter complaints">
      <SearchBar className="filters__search" value={filters.search} onChange={(search) => onChange({ ...filters, search })} placeholder="Search by title or description" label="Search complaints" />
      <Select aria-label="Status" placeholder="All statuses" options={STATUS_OPTIONS} value={filters.status} onChange={set('status')} />
      <Select aria-label="Priority" placeholder="All priorities" options={PRIORITY_OPTIONS} value={filters.priority} onChange={set('priority')} />
      <Select aria-label="Category" placeholder="All categories" options={COMPLAINT_CATEGORIES} value={filters.category} onChange={set('category')} />
      {active && <Button variant="ghost" leftIcon={X} onClick={onClear}>Clear</Button>}
    </div>
  );
}
