import type { Location } from 'react-router-dom';

// Where to go after signing in, e.g. back to an invite link. Kept in
// sessionStorage too because Google's redirect sign-in reloads the page.
const STORAGE_KEY = 'returnTo';

interface FromState {
  from?: { pathname: string; search?: string };
}

function readStorage(): string | null {
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

/** Remembers the page the user was sent away from, if any */
export function rememberReturnTo(location: Location): void {
  const from = (location.state as FromState | null)?.from;
  if (!from) return;
  try {
    sessionStorage.setItem(STORAGE_KEY, `${from.pathname}${from.search ?? ''}`);
  } catch {
    // Storage unavailable: the in-memory router state still works without a reload.
  }
}

/** The path to continue to after signing in; only same-app paths are allowed */
export function takeReturnTo(location: Location): string {
  const from = (location.state as FromState | null)?.from;
  const path = from ? `${from.pathname}${from.search ?? ''}` : readStorage();
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to clean up.
  }
  return path && path.startsWith('/') && !path.startsWith('//') ? path : '/';
}
