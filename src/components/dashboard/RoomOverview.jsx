import { BedDouble } from 'lucide-react';
import AsyncBoundary from '@/components/common/AsyncBoundary';
import Card, { CardHeader } from '@/components/common/Card';
import DescriptionList from '@/components/common/DescriptionList';
import EmptyState from '@/components/common/EmptyState';
import { ROOM_TYPES } from '@/constants/hostel';
import { labelFor } from '@/utils/format';
import SectionSkeleton from './SectionSkeleton';

/** `state` is the useAsync result for studentService.getProfile(), shared with the page header. */
export default function RoomOverview({ state }) {
  return (
    <Card>
      <CardHeader title="Your room" />
      <AsyncBoundary state={state} errorTitle="Unable to load room details" skeleton={<SectionSkeleton lines={4} />}>
        {(profile) => (profile.hostel ? (
          <DescriptionList
            items={[
              { label: 'Block', value: `Block ${profile.hostel.block}` },
              { label: 'Room number', value: profile.hostel.roomNumber },
              { label: 'Room type', value: labelFor(ROOM_TYPES, profile.hostel.roomType) },
              { label: 'Occupancy', value: `${profile.hostel.occupied} of ${profile.hostel.capacity} beds occupied` },
            ]}
          />
        ) : (
          <EmptyState icon={BedDouble} title="No room allocated yet" description="The warden allocates rooms. Your room details will appear here once assigned." />
        ))}
      </AsyncBoundary>
    </Card>
  );
}
