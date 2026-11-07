import { cn } from '@/utils/cn';

/** variant: neutral | primary | info | success | warning | danger */
export default function Badge({ variant = 'neutral', dot = false, className, children }) {
  return (
    <span className={cn('badge', variant !== 'neutral' && `badge--${variant}`, className)}>
      {dot && <span className="badge__dot" aria-hidden="true" />}
      {children}
    </span>
  );
}
