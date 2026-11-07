import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import Alert from '@/components/common/Alert';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import Input from '@/components/forms/Input';
import { useAuth } from '@/hooks/useAuth';
import { PATHS } from '@/constants/roles';
import { focusFirstInvalid } from '@/utils/dom';
import {
  normalizeEmail, normalizePhone, validateEmail, validateEnrollment, validateName, validatePhone,
} from '@/utils/validators';

const EMPTY = { name: '', email: '', phone: '', enrollmentNumber: '' };

function validate(values) {
  const errors = {
    name: validateName(values.name),
    email: validateEmail(values.email),
    phone: validatePhone(values.phone),
    enrollmentNumber: validateEnrollment(values.enrollmentNumber),
  };
  return Object.fromEntries(Object.entries(errors).filter(([, message]) => message));
}

/** Creates a student account in the "pending" state. A warden must approve it before sign-in grants access. */
export default function SignupPage() {
  const { signup } = useAuth();
  const formRef = useRef(null);
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
    setFormError('');
    const found = validate(values);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      focusFirstInvalid(formRef.current);
      return;
    }
    setSubmitting(true);
    try {
      await signup({
        name: values.name.trim(),
        email: normalizeEmail(values.email),
        phone: normalizePhone(values.phone),
        enrollmentNumber: values.enrollmentNumber.trim(),
      });
      setSubmitted(true);
    } catch (apiError) {
      const field = apiError.details?.field;
      if (field && field in EMPTY) setErrors({ [field]: apiError.message });
      else setFormError(apiError.message);
      focusFirstInvalid(formRef.current);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Card className="auth__card">
        <div className="auth__status">
          <span className="state__icon auth__status-icon--success" aria-hidden="true"><CheckCircle2 size={20} /></span>
          <h1 className="auth__title">Registration submitted</h1>
          <p className="auth__lead">
            Your registration has been submitted. Your account is awaiting verification by the hostel warden.
            Once approved, sign in with your college email or phone number.
          </p>
          <Button as={Link} to={PATHS.LOGIN} block>Back to sign in</Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="auth__card">
      <h1 className="auth__title">Create your account</h1>
      <p className="auth__lead">For hostel residents. The warden verifies every registration.</p>

      <form ref={formRef} className="stack" onSubmit={onSubmit} noValidate>
        {formError && <Alert variant="danger">{formError}</Alert>}
        <Input label="Full name" autoComplete="name" required {...bind('name')} />
        <Input label="College email" type="email" inputMode="email" autoComplete="email" placeholder="name@college.edu" required {...bind('email')} />
        <Input label="Mobile number" type="tel" inputMode="numeric" autoComplete="tel" placeholder="10-digit number" required {...bind('phone')} />
        <Input label="Enrollment number" hint="As printed on your college ID." autoComplete="off" required {...bind('enrollmentNumber')} />
        <Button type="submit" block loading={submitting}>Submit registration</Button>
      </form>

      <p className="auth__switch">Already registered? <Link to={PATHS.LOGIN}>Sign in</Link></p>
    </Card>
  );
}
