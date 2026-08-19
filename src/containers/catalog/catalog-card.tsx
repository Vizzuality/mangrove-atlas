import Link from 'next/link';

import type { StacIndexCatalog } from './types';
import { formatDate } from './utils';

export default function CatalogCard({ catalog }: { catalog: StacIndexCatalog }) {
  return (
    <Link
      href={`/catalog/${catalog.slug}`}
      className="focus-visible:ring-brand-800 hover:border-brand-800/40 flex h-full flex-col gap-2 rounded-2xl border border-black/10 bg-white p-6 shadow-sm transition hover:shadow-md focus-visible:ring-2 focus-visible:outline-none"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-bold text-black/85">{catalog.title}</h3>
        <span className="bg-brand-800/10 text-brand-800 shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold">
          {catalog.isApi ? 'API' : 'Catalog'}
        </span>
      </div>
      <p className="line-clamp-3 text-sm text-black/70">{catalog.summary}</p>
      {formatDate(catalog.updated) && (
        <p className="notranslate mt-auto pt-2 text-xs text-black/60">
          Updated {formatDate(catalog.updated)}
        </p>
      )}
    </Link>
  );
}
