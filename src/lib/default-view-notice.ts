// Remembers which saved default view the "Showing your default view" toast was
// last shown for. Keyed by the view's `saved_at`, so saving a new default view
// (new date) shows the toast again. Functional UI state, not tracking.

const DEFAULT_VIEW_NOTICE_NAME = 'gmw_default_view_notice';

// 12 months; a new save resets it anyway.
const MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export function readDefaultViewNotice(): string | null {
  if (typeof document === 'undefined') return null;
  for (const part of document.cookie.split(';')) {
    const [rawName, ...rest] = part.split('=');
    if (rawName?.trim() !== DEFAULT_VIEW_NOTICE_NAME) continue;
    return decodeURIComponent(rest.join('=').trim());
  }
  return null;
}

export function writeDefaultViewNotice(savedAt: string): void {
  if (typeof document === 'undefined') return;
  const secure =
    typeof location !== 'undefined' && location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${DEFAULT_VIEW_NOTICE_NAME}=${encodeURIComponent(savedAt)}; Max-Age=${MAX_AGE_SECONDS}; Path=/; SameSite=Lax${secure}`;
}
