'use client';

import { useEffect, useRef } from 'react';

import { readDefaultViewNotice, writeDefaultViewNotice } from '@/lib/default-view-notice';

import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

import { formatSavedAt, useDefaultView, VIEW_QUERY_KEYS } from 'hooks/use-default-view';

const hasViewParams = (keys: readonly string[]) => {
  const params = new URLSearchParams(window.location.search);
  return keys.some((key) => params.has(key));
};

// Applies the logged-in user's saved default view once, on the worldwide view only
// and only when the URL carries no view state (shared links always win).
export default function DefaultViewSync() {
  const { data: session, status } = useSession();
  const { applyView } = useDefaultView();

  const eligible = useRef<boolean | null>(null);
  const applied = useRef(false);

  const settings = session?.user?.settings;

  // Snapshot on mount, before the map's moveend writes `bounds` to the URL.
  useEffect(() => {
    if (eligible.current !== null) return;
    eligible.current = window.location.pathname === '/' && !hasViewParams(VIEW_QUERY_KEYS);
  }, []);

  useEffect(() => {
    if (applied.current || !eligible.current) return;
    if (status !== 'authenticated' || !settings) return;
    applied.current = true;

    // Settings may land late (session re-hydration); don't override anything the
    // user already changed by hand in the meantime.
    if (hasViewParams(['basemap', 'active-widgets', 'layers'])) return;

    applyView(settings);

    // Once per saved view: a new save (new saved_at) shows it again.
    const noticeKey = settings.saved_at ?? 'unknown';
    if (readDefaultViewNotice() === noticeKey) return;
    writeDefaultViewNotice(noticeKey);

    toast('Showing your default view', {
      description: settings.saved_at
        ? `You saved it on ${formatSavedAt(settings.saved_at)}.`
        : undefined,
    });
  }, [status, settings, applyView]);

  return null;
}
