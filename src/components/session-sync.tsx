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
  const { data: session, status, update } = useSession();
  const attempted = useRef(false);
  const hydrated = useRef(false);

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

  // Read-back: on load, re-hydrate the session from the canonical BE user so
  // reloads reflect server-side truth rather than the login-time JWT snapshot.
  // Runs once per mount; only writes the session when a field actually differs
  // to avoid a redundant JWT write / render churn. No reload (that path is
  // reserved for SSO restore above).
  useEffect(() => {
    if (status !== 'authenticated' || hydrated.current) return;
    hydrated.current = true;

    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((payload) => {
        if (!payload?.ok || !payload.data) return;

        const user = session?.user;
        const next = {
          name: payload.data.name ?? payload.data.username,
          email: payload.data.email,
          organization: payload.data.organization,
          roles: payload.data.user_roles ?? [],
          other_role: payload.data.user_role_other ?? null,
        };

        const differs =
          next.name !== user?.name ||
          next.email !== user?.email ||
          next.organization !== (user?.organization ?? undefined) ||
          next.other_role !== (user?.other_role ?? null) ||
          JSON.stringify(next.roles) !== JSON.stringify(user?.roles ?? []);

        if (differs) void update(next);
      })
      .catch(() => {});
  }, [status, session, update]);

  return null;
}
