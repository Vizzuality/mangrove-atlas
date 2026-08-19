'use client';

import { useMemo, useState } from 'react';

import CatalogCard from '@/containers/catalog/catalog-card';
import { useCatalogs } from '@/containers/catalog/hooks';

export default function CatalogPage() {
  const [search, setSearch] = useState('');
  const { data: catalogs, isLoading, isError } = useCatalogs();

  const filteredCatalogs = useMemo(() => {
    if (!catalogs) return [];
    const query = search.trim().toLowerCase();
    if (!query) return catalogs;
    return catalogs.filter((catalog) =>
      `${catalog.title} ${catalog.summary}`.toLowerCase().includes(query)
    );
  }, [catalogs, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-black/85">Catalogs</h1>
          {!!catalogs?.length && (
            <p className="text-sm text-black/60">
              <span className="notranslate">{filteredCatalogs.length}</span> of{' '}
              <span className="notranslate">{catalogs.length}</span> public catalogs
            </p>
          )}
        </div>
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search catalogs…"
          aria-label="Search catalogs"
          className="focus-visible:ring-brand-800 w-full max-w-xs rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-black/85 placeholder:text-black/40 focus-visible:ring-2 focus-visible:outline-none"
        />
      </div>

      {isLoading && <p className="animate-pulse text-sm text-black/60">Loading catalogs…</p>}
      {isError && (
        <p className="text-sm text-black/60">
          Catalogs could not be loaded. Please try again later.
        </p>
      )}
      {!isLoading && !isError && !filteredCatalogs.length && (
        <p className="text-sm text-black/60">No catalogs match your search.</p>
      )}

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCatalogs.map((catalog) => (
          <li key={catalog.id}>
            <CatalogCard catalog={catalog} />
          </li>
        ))}
      </ul>
    </div>
  );
}
