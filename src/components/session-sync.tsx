'use client';

import { useEffect, useRef } from 'react';

import { useSession } from 'next-auth/react';

const SSO_RESTORE_KEY = 'gmw-sso-restore-attempted';
const SSO_RESTORE_TTL = 60 * 1000; // Don't retry for 60 seconds

/**
 * Restores the next-auth session from the shared httpOnly SSO cookie.
 *
 * When a user logged in on MRTT visits GMW, they have no next-auth session
 * but the SSO cookie exists. This component calls the restore endpoint
 * which reads the cookie server-side and creates the next-auth session.
 *
 * Prevents loops via sessionStorage flag with TTL.
 */
export function SessionSync() {
  const { status, update } = useSession();
  const attempted = useRef(false);

  useEffect(() => {
    if (status !== 'unauthenticated' || attempted.current) return;
    attempted.current = true;

    // Prevent rapid retries across navigations
    const lastAttempt = sessionStorage.getItem(SSO_RESTORE_KEY);
    if (lastAttempt && Date.now() - Number(lastAttempt) < SSO_RESTORE_TTL) return;

    sessionStorage.setItem(SSO_RESTORE_KEY, String(Date.now()));

    fetch('/api/auth/sso/restore')
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          // next-auth session cookie was set by the server — refresh client state
          update();
        }
      })
      .catch(() => {});
  }, [status, update]);

  return null;
}
