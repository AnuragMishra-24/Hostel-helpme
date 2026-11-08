import { BedDouble } from 'lucide-react';
import AsyncBoundary from '@/components/common/AsyncBoundary';
import Card, { CardHeader } from '@/components/common/Card';
import DescriptionList from '@/components/common/DescriptionList';
import EmptyState from '@/components/common/EmptyState';
import PageHeader from '@/components/common/PageHeader';
import StatusBadge from '@/components/common/StatusBadge';
import { useAsync } from '@/hooks/useAsync';
import { studentService } from '@/services/studentService';
import { ROLE_LABELS } from '@/constants/roles';
import { ROOM_TYPES } from '@/constants/hostel';
import { formatDate, labelFor } from '@/utils/format';

/** Display-only: the API has no profile-editing contract yet. */
export default function ProfilePage() {
  const state = useAsync(() => studentService.getProfile(), []);

  return (
    <>
      <PageHeader title="Profile" description="Your account and hostel details. To change them, contact the hostel office." />
      <AsyncBoundary state={state} loadingLabel="Loading your profile…" errorTitle="Unable to load your profile">
        {(profile) => (
          <div className="grid grid--2">
            <Card>
              <CardHeader title="Personal details" />
              <DescriptionList
                items={[
                  { label: 'Full name', value: profile.name },
                  { label: 'College email', value: profile.email },
                  { label: 'Phone', value: profile.phone },
                  { label: 'Enrollment number', value: profile.enrollmentNumber },
                ]}
              />
            </Card>
            <Card>
              <CardHeader title="Account" />
              <DescriptionList
                items={[
                  { label: 'Role', value: ROLE_LABELS[profile.role] },
                  { label: 'Account status', value: <StatusBadge status={profile.status} /> },
                  { label: 'Registered on', value: formatDate(profile.registeredAt) },
                ]}
              />
            </Card>
            <Card>
              <CardHeader title="Hostel" />
              {profile.hostel ? (
                <DescriptionList
                  items={[
                    { label: 'Block', value: `Block ${profile.hostel.block}` },
                    { label: 'Room number', value: profile.hostel.roomNumber },
                    { label: 'Room type', value: labelFor(ROOM_TYPES, profile.hostel.roomType) },
                    { label: 'Occupancy', value: `${profile.hostel.occupied} of ${profile.hostel.capacity} beds` },
                  ]}
                />
              ) : (
                <EmptyState icon={BedDouble} title="No room allocated yet" description="Your room is allocated by the warden." />
              )}
            </Card>
          </div>
        )}
      </AsyncBoundary>
    </>
  );
}
