import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { cn } from '@/utils/cn';

/** Shared authenticated layout for all three roles. Navigation differs by `role` only. */
export default function AppShell({ role }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => { setDrawerOpen(false); }, [pathname]);

  useEffect(() => {
    if (!drawerOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onResize = () => { if (window.innerWidth >= 1024) setDrawerOpen(false); };
    window.addEventListener('resize', onResize);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('resize', onResize);
    };
  }, [drawerOpen]);

  return (
    <div className="shell">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Sidebar role={role} open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <div className={cn('shell__scrim', drawerOpen && 'is-visible')} onClick={() => setDrawerOpen(false)} aria-hidden="true" />
      <div className="shell__main">
        <Header role={role} onMenuClick={() => setDrawerOpen(true)} />
        <main id="main-content" className="page" tabIndex={-1}>
          <div key={pathname} className="page-enter">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
