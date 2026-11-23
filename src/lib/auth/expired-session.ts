import { signOut } from 'next-auth/react';
import { toast } from 'sonner';

let handling = false;

/**
 * The NextAuth session outlives the backend token (30 days vs. the token's own
 * expiry). When the backend starts rejecting it, the UI kept showing the user
 * as logged in while every save failed silently. Log out cleanly instead.
 * Idempotent: parallel 401s trigger a single logout.
 */
export async function handleExpiredSession() {
  if (handling || typeof window === 'undefined') return;
  handling = true;
  try {
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    await signOut({ redirect: false });
    toast.error('Your session has expired. Please log in again.');
  } finally {
    handling = false;
  }
}
