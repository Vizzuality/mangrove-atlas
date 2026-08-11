import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Account',
};

/**
 * The auth pages are all `'use client'`, so they cannot export `metadata`
 * themselves — this layout (and the per-route layouts beside each page)
 * supplies it. Metadata only: no wrapper element.
 *
 * The main landmark is deliberately *not* here. Wrapping `children` in one made
 * main cover the whole screen — the logo, the decorative hero and the landing
 * nav included — when the main content of these routes is just the form column.
 * Each auth page marks its own form column as `<main id="main-content">`, which
 * is what the root layout's skip link targets.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return children;
}
