import Card from '@/components/common/Card';
import DescriptionList from '@/components/common/DescriptionList';
import StatusBadge from '@/components/common/StatusBadge';
import { BLOCKS, ROOM_CHANGE_REASONS, ROOM_REQUEST_STATUS_TEXT, ROOM_TYPES } from '@/constants/hostel';
import { formatDate, formatDateTime, labelFor } from '@/utils/format';

/** One room-change request with its status, the student's preference and the warden's decision (if any). */
export default function RoomRequestCard({ request, title }) {
  const preference = [
    request.preferredBlock && BLOCKS.includes(request.preferredBlock) ? `Block ${request.preferredBlock}` : null,
    request.preferredRoomType ? labelFor(ROOM_TYPES, request.preferredRoomType) : null,
  ].filter(Boolean).join(' · ');

  return (
    <Card>
      <div className="card__header">
        <div>
          <h3 className="card__title">{title ?? `Request ${request.id}`}</h3>
          <p className="card__description">Submitted {formatDate(request.createdAt)}</p>
        </div>
        <StatusBadge status={request.status} />
      </div>
      <p className="text-secondary request__explain">{ROOM_REQUEST_STATUS_TEXT[request.status]}</p>
      <DescriptionList
        items={[
          { label: 'Current room', value: `Block ${request.currentRoom.block} · ${request.currentRoom.roomNumber} (${labelFor(ROOM_TYPES, request.currentRoom.roomType)})` },
          { label: 'Preference', value: preference || 'No preference' },
          { label: 'Reason', value: labelFor(ROOM_CHANGE_REASONS, request.reason) },
          { label: 'Details', value: request.description, block: true },
          { label: 'Last updated', value: formatDateTime(request.updatedAt) },
          ...(request.decision ? [{ label: 'Warden’s note', value: request.decision.note, block: true }] : []),
        ]}
      />
    </Card>
  );
}
