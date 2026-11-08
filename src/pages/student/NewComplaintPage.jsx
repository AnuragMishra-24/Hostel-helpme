import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Alert from '@/components/common/Alert';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import PageHeader from '@/components/common/PageHeader';
import FileUploader from '@/components/forms/FileUploader';
import Input from '@/components/forms/Input';
import Select from '@/components/forms/Select';
import Textarea from '@/components/forms/Textarea';
import { useToast } from '@/context/ToastContext';
import { useAsync } from '@/hooks/useAsync';
import { complaintService } from '@/services/complaintService';
import { studentService } from '@/services/studentService';
import {
  COMPLAINT_CATEGORIES, DESCRIPTION_MAX_WORDS, DESCRIPTION_MIN_LENGTH, EVIDENCE_RULES, TITLE_MAX_LENGTH, TITLE_MIN_LENGTH,
} from '@/constants/complaints';
import { BLOCKS } from '@/constants/hostel';
import { STUDENT_PATHS } from '@/constants/roles';
import { focusFirstInvalid } from '@/utils/dom';
import { countWords } from '@/utils/validators';

const BLOCK_OPTIONS = BLOCKS.map((block) => ({ value: block, label: `Block ${block}` }));
const EMPTY = { title: '', description: '', category: '', block: '', roomNumber: '' };

function validate(values) {
  const errors = {};
  const title = values.title.trim();
  if (!title) errors.title = 'Enter a title.';
  else if (title.length < TITLE_MIN_LENGTH) errors.title = `Use at least ${TITLE_MIN_LENGTH} characters.`;
  else if (title.length > TITLE_MAX_LENGTH) errors.title = `Keep the title under ${TITLE_MAX_LENGTH} characters.`;

  const description = values.description.trim();
  if (!description) errors.description = 'Describe the problem.';
  else if (description.length < DESCRIPTION_MIN_LENGTH) errors.description = 'Add a little more detail so the warden can understand the issue.';
  else if (countWords(description) > DESCRIPTION_MAX_WORDS) errors.description = `Keep the description within ${DESCRIPTION_MAX_WORDS} words.`;

  if (!values.category) errors.category = 'Select a category.';
  if (!values.block) errors.block = 'Select a block.';
  if (!values.roomNumber.trim()) errors.roomNumber = 'Enter your room number.';
  return errors;
}

export default function NewComplaintPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const formRef = useRef(null);
  const uploaded = useRef({}); // file id → evidence metadata, so a retry does not re-upload

  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Pre-fill block and room from the student's allocation (still editable).
  const profile = useAsync(() => studentService.getProfile(), []);
  useEffect(() => {
    const hostel = profile.data?.hostel;
    if (hostel) setValues((prev) => ({ ...prev, block: prev.block || hostel.block, roomNumber: prev.roomNumber || hostel.roomNumber }));
  }, [profile.data]);

  const words = countWords(values.description);
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
    const found = validate(values);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      focusFirstInvalid(formRef.current);
      return;
    }
    setSubmitting(true);
    try {
      const evidence = [];
      for (const item of files) {
        if (!uploaded.current[item.id]) {
          uploaded.current[item.id] = await complaintService.uploadEvidence(item.file, {
            onProgress: (percent) => setProgress((prev) => ({ ...prev, [item.id]: percent })),
          });
        }
        evidence.push(uploaded.current[item.id]);
      }
      const complaint = await complaintService.createComplaint({
        title: values.title.trim(),
        description: values.description.trim(),
        category: values.category,
        block: values.block,
        roomNumber: values.roomNumber.trim(),
        evidence,
      });
      toast.success('Your complaint has been submitted.');
      navigate(STUDENT_PATHS.complaint(complaint.id));
    } catch (apiError) {
      setSubmitError(apiError.message);
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="New complaint"
        description="Describe the problem. The warden will review it and assign it for repair."
        actions={<Button as={Link} to={STUDENT_PATHS.complaints} variant="secondary" leftIcon={ArrowLeft}>Back to complaints</Button>}
      />
      <Card className="form-card">
        <form ref={formRef} className="stack" onSubmit={onSubmit} noValidate>
          {submitError && <Alert variant="danger" title="Your complaint was not submitted">{submitError}</Alert>}
          <Input label="Title" placeholder="Short summary of the issue" maxLength={TITLE_MAX_LENGTH + 20} required {...bind('title')} />
          <Select label="Category" placeholder="Select a category" options={COMPLAINT_CATEGORIES} required {...bind('category')} />
          <div className="grid grid--2">
            <Select label="Block" placeholder="Select a block" options={BLOCK_OPTIONS} required {...bind('block')} />
            <Input label="Room number" placeholder="e.g. 301" autoComplete="off" required {...bind('roomNumber')} />
          </div>
          <Textarea
            label="Description"
            placeholder="What is wrong, where exactly, and since when?"
            rows={6}
            hint={`${words} / ${DESCRIPTION_MAX_WORDS} words`}
            required
            {...bind('description')}
          />
          <FileUploader
            label="Photo or video evidence (optional)"
            types={EVIDENCE_RULES.types}
            maxSizeMB={EVIDENCE_RULES.maxSizeMB}
            maxFiles={EVIDENCE_RULES.maxFiles}
            value={files}
            onChange={setFiles}
            progress={progress}
            disabled={submitting}
          />
          <div className="form-actions">
            <Button as={Link} to={STUDENT_PATHS.complaints} variant="secondary" aria-disabled={submitting || undefined}>Cancel</Button>
            <Button type="submit" loading={submitting}>{submitting ? 'Submitting…' : 'Submit complaint'}</Button>
          </div>
        </form>
      </Card>
    </>
  );
}
