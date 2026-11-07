import { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import Alert from '@/components/common/Alert';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import OtpInput from '@/components/forms/OtpInput';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/hooks/useAuth';
import { useCountdown } from '@/hooks/useCountdown';
import { AUTH_METHODS, OTP_LENGTH } from '@/constants/auth';
import { PATHS } from '@/constants/roles';
import { maskIdentifier } from '@/utils/format';

const DEFAULT_RESEND_SECONDS = 30;

/**
 * Step 2 of sign-in. Needs { method, identifier } from router state (set by LoginPage);
 * without it there is nothing to verify, so the user is sent back to /login.
 * On success AuthContext holds the session and GuestRoute redirects to the right dashboard.
 */
export default function VerifyOtpPage() {
  const { state } = useLocation();
  const { sendOtp, verifyOtp } = useAuth();
  const toast = useToast();

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [devOtp, setDevOtp] = useState(state?.devOtp);
  const cooldown = useCountdown(state?.resendAfterSeconds ?? 0);

  if (!state?.identifier) return <Navigate to={PATHS.LOGIN} replace />;

  const { method, identifier, from } = state;
  const isEmail = method === AUTH_METHODS.EMAIL;
  const masked = maskIdentifier(method, identifier);

  const onSubmit = async (event) => {
    event.preventDefault();
    if (otp.length !== OTP_LENGTH) {
      setError(`Enter the ${OTP_LENGTH}-digit code.`);
      return;
    }
    setVerifying(true);
    try {
      await verifyOtp({ method, identifier, otp });
      toast.success('Signed in.');
    } catch (apiError) {
      setError(apiError.message);
      setOtp('');
      setVerifying(false);
    }
  };

  const onResend = async () => {
    setResending(true);
    try {
      const result = await sendOtp({ method, identifier });
      setDevOtp(result.devOtp);
      cooldown.restart(result.resendAfterSeconds ?? DEFAULT_RESEND_SECONDS);
      setOtp('');
      setError('');
      toast.success(result.devOtp ? 'New code generated (development mode).' : 'A new code has been sent.');
    } catch (apiError) {
      toast.error(apiError.message);
    } finally {
      setResending(false);
    }
  };

  return (
    <Card className="auth__card">
      <h1 className="auth__title">Enter your code</h1>
      <p className="auth__lead">
        {devOtp ? `Enter the ${OTP_LENGTH}-digit code for ${masked}.` : `We sent a ${OTP_LENGTH}-digit code to ${masked}.`}
      </p>

      {devOtp && (
        <Alert variant="info" title="Development mode" className="auth__dev auth__dev--top">
          No message was sent. Use the code {devOtp}.
        </Alert>
      )}

      <form className="stack auth__form" onSubmit={onSubmit} noValidate>
        <OtpInput
          label="Verification code"
          name="otp"
          value={otp}
          onChange={(next) => { setOtp(next); if (error) setError(''); }}
          error={error}
          autoFocus
          required
        />
        <Button type="submit" block loading={verifying}>Verify and sign in</Button>
      </form>

      <div className="auth__actions">
        <Button variant="ghost" size="sm" onClick={onResend} disabled={cooldown.seconds > 0 || verifying} loading={resending}>
          {cooldown.seconds > 0 ? `Resend code in ${cooldown.seconds}s` : 'Resend code'}
        </Button>
        <Link to={PATHS.LOGIN} state={{ from, method, identifier }}>
          {isEmail ? 'Use a different email' : 'Use a different number'}
        </Link>
      </div>
    </Card>
  );
}
