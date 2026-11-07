import { Outlet } from 'react-router-dom';
import { Check } from 'lucide-react';
import Brand from '@/components/common/Brand';

const POINTS = [
  'Raise and track hostel complaints',
  'Request room changes and follow their status',
  'Stay current on notices, fees and mess timings',
];

/** Shell for unauthenticated pages (login now; signup and OTP in Phase 2). */
export default function AuthLayout() {
  return (
    <div className="auth">
      <aside className="auth__panel">
        <Brand inverse />
        <div className="auth__pitch">
          <h2 className="auth__headline">Hostel operations, in one place.</h2>
          <ul className="auth__points">
            {POINTS.map((point) => (
              <li key={point}><Check size={16} aria-hidden="true" />{point}</li>
            ))}
          </ul>
        </div>
        <p className="auth__footer">College hostel management platform</p>
      </aside>
      <main className="auth__main" id="main-content">
        <Outlet />
      </main>
    </div>
  );
}
