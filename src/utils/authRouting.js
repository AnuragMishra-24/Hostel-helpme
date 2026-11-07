import { ACCOUNT_STATUS } from '@/constants/auth';
import { PATHS, ROLE_BASE_PATH, ROLE_HOME } from '@/constants/roles';

export const isAwaitingApproval = (user) => user.status !== ACCOUNT_STATUS.APPROVED;

/** Where a signed-in user belongs: their dashboard, or the status page until approved. */
export const getHomePath = (user) => (isAwaitingApproval(user) ? PATHS.ACCOUNT_STATUS : ROLE_HOME[user.role]);

/** After sign-in, return to the page the user originally wanted — only if their role may view it. */
export function resolvePostLoginPath(user, from) {
  const home = getHomePath(user);
  if (isAwaitingApproval(user) || typeof from !== 'string') return home;
  const base = ROLE_BASE_PATH[user.role];
  return from === base || from.startsWith(`${base}/`) ? from : home;
}
