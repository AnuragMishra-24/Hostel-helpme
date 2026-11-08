import { useRef, useState } from 'react';
import { BedDouble, DoorOpen } from 'lucide-react';
import AsyncBoundary from '@/components/common/AsyncBoundary';
import Alert from '@/components/common/Alert';
import Button from '@/components/common/Button';
import Card, { CardHeader } from '@/components/common/Card';
import DescriptionList from '@/components/common/DescriptionList';
import EmptyState from '@/components/common/EmptyState';
import PageHeader from '@/components/common/PageHeader';
import Select from '@/components/forms/Select';
import Textarea from '@/components/forms/Textarea';
import RoomRequestCard from '@/components/roomRequests/RoomRequestCard';
import { useToast } from '@/context/ToastContext';
import { useAsync } from '@/hooks/useAsync';
import { roomRequestService } from '@/services/roomRequestService';
import { studentService } from '@/services/studentService';
import { BLOCKS, ROOM_CHANGE_REASONS, ROOM_TYPES } from '@/constants/hostel';
import { focusFirstInvalid } from '@/utils/dom';
import { labelFor } from '@/utils/format';
import { countWords } from '@/utils/validators';

const ACTIVE = ['pending', 'under_review'];
const MAX_WORDS = 200;
const BLOCK_OPTIONS = BLOCKS.map((block) => ({ value: block, label: `Block ${block}` }));
const EMPTY = { reason: '', preferredBlock: '', preferredRoomType: '', description: '' };

function RequestForm({ onCreated }) {
  const toast = useToast();
  const formRef = useRef(null);
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const bind = (field) => ({
    name: field,
    value: values[field],
    error: errors[field],
    onChange: (event) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    },
  });

  const onSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');
    const found = {};
    if (!values.reason) found.reason = 'Select a reason.';
    const description = values.description.trim();
    if (description.length < 10) found.description = 'Explain your request in a little more detail.';
    else if (countWords(description) > MAX_WORDS) found.description = `Keep this within ${MAX_WORDS} words.`;
    if (Object.keys(found).length) {
      setErrors(found);
      focusFirstInvalid(formRef.current);
      return;
    }
    setSubmitting(true);
    try {
      await roomRequestService.createRequest({ ...values, description });
      toast.success('Your room-change request has been submitted.');
      onCreated();
    } catch (apiError) {
      setSubmitError(apiError.message);
      if (apiError.code === 'REQUEST_EXISTS') onCreated();
      setSubmitting(false);
    }
  };

  return (
    <Card className="form-card">
      <CardHeader title="Request a room change" description="The warden reviews every request and decides on any allocation. Submitting does not guarantee a new room." />
      <form ref={formRef} className="stack" onSubmit={onSubmit} noValidate>
        {submitError && <Alert variant="danger">{submitError}</Alert>}
        <Select label="Reason" placeholder="Select a reason" options={ROOM_CHANGE_REASONS} required {...bind('reason')} />
        <div className="grid grid--2">
          <Select label="Preferred block" placeholder="No preference" options={BLOCK_OPTIONS} {...bind('preferredBlock')} />
          <Select label="Preferred room type" placeholder="No preference" options={ROOM_TYPES} {...bind('preferredRoomType')} />
        </div>
        <Textarea
          label="Details"
          placeholder="Tell the warden what is happening and what you are looking for."
          rows={5}
          hint={`${countWords(values.description)} / ${MAX_WORDS} words`}
          required
          {...bind('description')}
        />
        <div className="form-actions">
          <Button type="submit" loading={submitting}>Submit request</Button>
        </div>
      </form>
    </Card>
  );
}

export default function RoomRequestPage() {
  const profile = useAsync(() => studentService.getProfile(), []);
  const requests = useAsync(() => roomRequestService.getRequests(), []);

  return (
    <>
      <PageHeader title="Room request" description="Request a room change and follow its status." />
      <div className="stack" style={{ '--stack-gap': 'var(--space-5)' }}>
        <AsyncBoundary state={profile} loadingLabel="Loading your room…" errorTitle="Unable to load your room">
          {(student) => {
            const { hostel } = student;
            if (!hostel) {
              return <EmptyState bordered icon={BedDouble} title="No room allocated yet" description="Room changes are available once the warden has allocated you a room." />;
            }
            return (
              <>
                <Card>
                  <CardHeader title="Your current room" />
                  <DescriptionList
                    items={[
                      { label: 'Block', value: `Block ${hostel.block}` },
                      { label: 'Room number', value: hostel.roomNumber },
                      { label: 'Room type', value: labelFor(ROOM_TYPES, hostel.roomType) },
                    ]}
                  />
                </Card>
                <AsyncBoundary state={requests} loadingLabel="Loading requests…" errorTitle="Unable to load your requests">
                  {({ items }) => {
                    const active = items.find((request) => ACTIVE.includes(request.status));
                    const history = items.filter((request) => request !== active);
                    return (
                      <>
                        {active ? <RoomRequestCard request={active} title="Your open request" /> : <RequestForm onCreated={requests.reload} />}
                        <section className="stack" aria-labelledby="request-history">
                          <h2 className="section-title" id="request-history">Request history</h2>
                          {history.length === 0 ? (
                            <EmptyState bordered icon={DoorOpen} title="No room-change requests found" description="Your previous requests will be listed here." />
                          ) : history.map((request) => <RoomRequestCard key={request.id} request={request} />)}
                        </section>
                      </>
                    );
                  }}
                </AsyncBoundary>
              </>
            );
          }}
        </AsyncBoundary>
      </div>
    </>
  );
}
