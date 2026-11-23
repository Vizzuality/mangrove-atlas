/**
 * Sanitise a post-login `callbackUrl` to a same-origin path (open-redirect guard).
 *
 * Absolute URLs are accepted only when they point at this origin — the SSO
 * authorize route sends users here with its own absolute URL
 * (`https://<gmw>/api/auth/sso/authorize?...`), and rejecting it dropped MRTT
 * users on the GMW home page instead of finishing the SSO hand-off.
 */
export function getSafeCallbackUrl(callbackUrl: string | null): string {
  const raw = typeof callbackUrl === 'string' && callbackUrl ? callbackUrl : '/';

  if (typeof window !== 'undefined' && /^https?:\/\//i.test(raw)) {
    try {
      const url = new URL(raw);
      if (url.origin !== window.location.origin) return '/';
      return `${url.pathname}${url.search}${url.hash}` || '/';
    } catch {
      return '/';
    }
  }

  // Only allow same-origin relative paths.
  if (!raw.startsWith('/')) return '/';
  // Disallow protocol-relative URLs like //example.com.
  if (raw.startsWith('//') || raw.startsWith('/\\')) return '/';
  // Disallow embedded schemes such as http:// or https:// in the path.
  if (raw.includes('://')) return '/';

  return raw;
}

/** Route handlers (e.g. /api/auth/sso/authorize) need a full navigation, not a client route change. */
export const isApiCallback = (path: string) => path.startsWith('/api/');

/**
 * Login started by the SSO bridge. The current session may hold a token the
 * backend just rejected, so an authenticated user must still see the form and
 * sign in again instead of being bounced away (which looped back to signin).
 */
export const isSSOCallback = (path: string) => path.startsWith('/api/auth/sso/');

export function goToCallback(path: string, replace: (href: string) => void) {
  if (isApiCallback(path)) {
    window.location.assign(path);
  } else {
    replace(path);
  }
}
