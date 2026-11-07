import { useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mail, Phone } from 'lucide-react';
import Alert from '@/components/common/Alert';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import Tabs from '@/components/common/Tabs';
import Input from '@/components/forms/Input';
import { useAuth } from '@/hooks/useAuth';
import { IS_DEV, USE_MOCK } from '@/config/env';
import { AUTH_METHODS } from '@/constants/auth';
import { PATHS } from '@/constants/roles';
import { focusFirstInvalid } from '@/utils/dom';
import { normalizeIdentifier, validateIdentifier } from '@/utils/validators';

const METHODS = [
  { value: AUTH_METHODS.EMAIL, label: 'College email' },
  { value: AUTH_METHODS.PHONE, label: 'Phone number' },
];

const FIELD = {
  [AUTH_METHODS.EMAIL]: { label: 'College email', type: 'email', name: 'email', icon: Mail, placeholder: 'name@college.edu', autoComplete: 'email', hint: 'We will send a one-time code to this address.' },
  [AUTH_METHODS.PHONE]: { label: 'Mobile number', type: 'tel', name: 'phone', icon: Phone, placeholder: '10-digit number', autoComplete: 'tel', hint: 'We will send a one-time code to this number.' },
};

/** Step 1 of sign-in: collect the identifier and request a code. Step 2 is /verify-otp. */
export default function LoginPage() {
  const navigate = useNavigate();
  const { state: routeState } = useLocation();
  const { sendOtp } = useAuth();
  const formRef = useRef(null);

  const [method, setMethod] = useState(routeState?.method ?? AUTH_METHODS.EMAIL);
  const [values, setValues] = useState({
    [AUTH_METHODS.EMAIL]: routeState?.method === AUTH_METHODS.EMAIL ? routeState.identifier : '',
    [AUTH_METHODS.PHONE]: routeState?.method === AUTH_METHODS.PHONE ? routeState.identifier : '',
  });
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  const field = FIELD[method];

  const changeMethod = (next) => { setMethod(next); setError(''); };
  const changeValue = (event) => {
    setValues((prev) => ({ ...prev, [method]: event.target.value }));
    if (error) setError('');
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const validationError = validateIdentifier(method, values[method]);
    if (validationError) {
      setError(validationError);
      focusFirstInvalid(formRef.current);
      return;
    }
    const identifier = normalizeIdentifier(method, values[method]);
    setSending(true);
    try {
      const result = await sendOtp({ method, identifier });
      navigate(PATHS.VERIFY_OTP, {
        state: { method, identifier, from: routeState?.from, resendAfterSeconds: result.resendAfterSeconds, devOtp: result.devOtp },
      });
    } catch (apiError) {
      setError(apiError.message);
      setSending(false);
      focusFirstInvalid(formRef.current);
    }
  };

  return (
    <Card className="auth__card">
      <h1 className="auth__title">Welcome to Hostel HelpMe</h1>
      <p className="auth__lead">Sign in with a one-time code.</p>

      <Tabs tabs={METHODS} value={method} onChange={changeMethod} label="Sign-in method" idPrefix="login" />

      <form
        ref={formRef}
        className="stack auth__form"
        onSubmit={onSubmit}
        role="tabpanel"
        id={`login-panel-${method}`}
        aria-labelledby={`login-tab-${method}`}
        noValidate
      >
        <Input
          key={method}
          label={field.label}
          type={field.type}
          name={field.name}
          icon={field.icon}
          placeholder={field.placeholder}
          autoComplete={field.autoComplete}
          inputMode={method === AUTH_METHODS.PHONE ? 'numeric' : 'email'}
          hint={field.hint}
          error={error}
          value={values[method]}
          onChange={changeValue}
          required
        />
        <Button type="submit" block loading={sending}>Send code</Button>
      </form>

      <p className="auth__switch">New student? <Link to={PATHS.SIGNUP}>Create an account</Link></p>

      {USE_MOCK && (
        <Alert variant="info" title="Mock authentication is on" className="auth__dev">
          No messages are sent. Use any development account listed in the README.
        </Alert>
      )}
      {IS_DEV && <p className="auth__preview"><Link to={PATHS.COMPONENT_SHOWCASE}>Open the component preview</Link></p>}
    </Card>
  );
}
