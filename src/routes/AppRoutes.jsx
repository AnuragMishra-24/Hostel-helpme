import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from '@/components/layout/AppShell';
import AuthLayout from '@/components/layout/AuthLayout';
import AccountStatusPage from '@/pages/auth/AccountStatusPage';
import LoginPage from '@/pages/auth/LoginPage';
import SignupPage from '@/pages/auth/SignupPage';
import VerifyOtpPage from '@/pages/auth/VerifyOtpPage';
import NotFoundPage from '@/pages/common/NotFoundPage';
import PlaceholderPage from '@/pages/common/PlaceholderPage';
import ComponentShowcase from '@/pages/dev/ComponentShowcase';
import { EXTRA_PAGES, PAGE_REGISTRY } from './pageRegistry';
import { AccountStatusRoute, GuestRoute, ProtectedRoute } from './guards';
import { NAV_BY_ROLE } from '@/constants/navigation';
import { PATHS, ROLES, ROLE_BASE_PATH, ROLE_HOME } from '@/constants/roles';
import { IS_DEV } from '@/config/env';

function renderRoleRoutes(role) {
  const extras = (EXTRA_PAGES[role] ?? []).map(({ path, Page }) => <Route key={path} path={path} element={<Page />} />);
  const navRoutes = NAV_BY_ROLE[role].map((item) => {
    const Page = PAGE_REGISTRY[role]?.[item.key];
    const slug = item.path.slice(ROLE_BASE_PATH[role].length + 1);
    return (
      <Route
        key={item.key}
        path={slug}
        element={Page ? <Page /> : <PlaceholderPage title={item.label} description={item.description} icon={item.icon} />}
      />
    );
  });
  return [...navRoutes, ...extras];
}

// Guards live in ./guards: GuestRoute (auth pages), AccountStatusRoute (unapproved users)
// and ProtectedRoute (one per role). Authorization is enforced again by the backend.
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={PATHS.LOGIN} replace />} />

      <Route element={<AuthLayout />}>
        <Route element={<GuestRoute />}>
          <Route path={PATHS.LOGIN} element={<LoginPage />} />
          <Route path={PATHS.SIGNUP} element={<SignupPage />} />
          <Route path={PATHS.VERIFY_OTP} element={<VerifyOtpPage />} />
        </Route>
        <Route element={<AccountStatusRoute />}>
          <Route path={PATHS.ACCOUNT_STATUS} element={<AccountStatusPage />} />
        </Route>
      </Route>

      {Object.values(ROLES).map((role) => (
        <Route key={role} element={<ProtectedRoute role={role} />}>
          <Route path={ROLE_BASE_PATH[role]} element={<AppShell role={role} />}>
            <Route index element={<Navigate to={ROLE_HOME[role]} replace />} />
            {renderRoleRoutes(role)}
            <Route path="*" element={<NotFoundPage homePath={ROLE_HOME[role]} />} />
          </Route>
        </Route>
      ))}

      {IS_DEV && <Route path={PATHS.COMPONENT_SHOWCASE} element={<ComponentShowcase />} />}

      <Route path="*" element={<NotFoundPage standalone />} />
    </Routes>
  );
}
