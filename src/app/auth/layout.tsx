import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Account',
};

/**
 * The auth pages are all `'use client'`, so they cannot export `metadata`
 * themselves — this layout (and the per-route layouts beside each page)
 * supplies it.
 *
 * It also provides the `<main id="main-content">` landmark. The root layout
 * renders a "Skip to main content" link on every route, and without this the
 * link pointed at nothing here: the auth pages wrap their content in
 * `<section>`, so there was no main landmark to skip to.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <main id="main-content">{children}</main>;
}
