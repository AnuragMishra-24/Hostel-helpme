import { forwardRef } from 'react';
import Input from './Input';
import { OTP_LENGTH } from '@/constants/auth';

/**
 * One numeric field rather than six boxes: it works with paste, SMS autofill,
 * screen readers and the on-screen numeric keypad. Accepts digits only.
 */
const OtpInput = forwardRef(function OtpInput({ value, onChange, length = OTP_LENGTH, ...rest }, ref) {
  return (
    <Input
      ref={ref}
      value={value}
      onChange={(event) => onChange(event.target.value.replace(/\D/g, '').slice(0, length))}
      inputMode="numeric"
      autoComplete="one-time-code"
      maxLength={length}
      placeholder={'•'.repeat(length)}
      className="control--otp"
      {...rest}
    />
  );
});

export default OtpInput;
