'use client';

import { useEffect, useRef } from 'react';

import { useSession } from 'next-auth/react';

const SSO_RESTORE_KEY = 'gmw-sso-restore-attempted';
const SSO_RESTORE_TTL = 60 * 1000; // Don't retry for 60 seconds
const SSO_RESTORE_RELOADED_KEY = 'gmw-sso-restore-reloaded';

/**
 * Restores the next-auth session from the shared httpOnly SSO cookie.
 *
 * When a user logged in on MRTT visits GMW, they have no next-auth session
 * but the SSO cookie exists. This component calls the restore endpoint
 * which reads the cookie server-side and creates the next-auth session.
 *
 * On success it forces a single page reload so consumers that don't subscribe
 * to next-auth's session context (Jotai atoms, server-rendered chunks, etc.)
 * pick up the new identity without the user clicking refresh. A
 * sessionStorage flag guards against reload loops.
 *
 * Prevents repeated /restore calls via a separate sessionStorage TTL flag.
 */
export function SessionSync() {
  const { status, update } = useSession();
  const attempted = useRef(false);

  useEffect(() => {
    if (status !== 'unauthenticated' || attempted.current) return;
    attempted.current = true;

    // Prevent rapid retries across navigations. Only set the suppression flag
    // on a successful or definitive negative response so that transient
    // network/CORS failures don't lock the user out of retries for 60s.
    const lastAttempt = sessionStorage.getItem(SSO_RESTORE_KEY);
    if (lastAttempt && Date.now() - Number(lastAttempt) < SSO_RESTORE_TTL) return;

    fetch('/api/auth/sso/restore')
      .then((res) => res.json())
      .then((data) => {
        sessionStorage.setItem(SSO_RESTORE_KEY, String(Date.now()));
        if (!data.ok) return;

        // Reload once so SSR-rendered content and non-next-auth subscribers
        // (Jotai atoms, React Query caches keyed on the session token) refetch
        // with the freshly-set next-auth cookie. The guard prevents looping if
        // the reload somehow lands back here still unauthenticated.
        if (sessionStorage.getItem(SSO_RESTORE_RELOADED_KEY)) {
          update();
          return;
        }
        sessionStorage.setItem(SSO_RESTORE_RELOADED_KEY, '1');
        window.location.reload();
      })
      .catch(() => {});
  }, [status, update]);

  // Once we observe an authenticated session, clear the reload guard so a
  // future logout-and-back-in cycle can reload again.
  useEffect(() => {
    if (status === 'authenticated') {
      sessionStorage.removeItem(SSO_RESTORE_RELOADED_KEY);
    }
  }, [status]);

  return null;
}
