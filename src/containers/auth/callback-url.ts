/**
 * Sanitise a post-login `callbackUrl` to a same-origin path (open-redirect guard).
 *
 * Absolute URLs are accepted only when they point at this origin — the SSO
 * authorize route sends users here with its own absolute URL
 * (`https://<gmw>/api/auth/sso/authorize?...`), and rejecting it dropped MRTT
 * users on the GMW home page instead of finishing the SSO hand-off.
 */
export function getSafeCallbackUrl(callbackUrl: string | null): string {
  const raw = typeof callbackUrl === 'string' ? callbackUrl.trim() : '';
  if (!raw) return '/';

  // Backslashes and control characters are normalised away by browsers
  // ("/\t/evil.com" → "//evil.com"), so reject them before resolving.

  if (/[\\\u0000-\u001f\u007f]/.test(raw)) return '/';

  // Server render has no origin to compare against; only allow plain paths.
  if (typeof window === 'undefined') {
    return raw.startsWith('/') && !raw.startsWith('//') ? raw : '/';
  }

  // Resolve against our origin and compare origins instead of string prefixes,
  // so relative and absolute inputs go through the same check.
  try {
    const url = new URL(raw, window.location.origin);
    if (url.origin !== window.location.origin) return '/';
    return `${url.pathname}${url.search}${url.hash}` || '/';
  } catch {
    return '/';
  }
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
