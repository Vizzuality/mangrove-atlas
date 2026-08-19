'use client';

import type { StacLink } from './types';
import { linkLabel } from './utils';

type NodeChildrenProps = {
  title: string;
  links: StacLink[];
  onNavigate: (href: string) => void;
};

export default function NodeChildren({ title, links, onNavigate }: NodeChildrenProps) {
  if (!links.length) return null;

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-bold tracking-wide text-black/85 uppercase">{title}</h2>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((link) => (
          <li key={link.href}>
            <button
              type="button"
              onClick={() => onNavigate(link.href)}
              className="focus-visible:ring-brand-800 hover:border-brand-800/40 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-left text-sm font-semibold text-black/85 shadow-sm transition hover:shadow-md focus-visible:ring-2 focus-visible:outline-none"
            >
              {linkLabel(link)}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
