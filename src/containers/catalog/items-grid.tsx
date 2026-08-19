'use client';

import { useStacItems } from './hooks';
import { formatDatetime, getItemThumbnail, getSelfHref } from './utils';

type ItemsGridProps = {
  itemsUrl: string;
  onNavigate: (href: string) => void;
  /** Lowercased text query; filters the pages loaded so far client-side. */
  filter?: string;
};

export default function ItemsGrid({ itemsUrl, onNavigate, filter = '' }: ItemsGridProps) {
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useStacItems(itemsUrl);

  if (isLoading) return <p className="animate-pulse text-sm text-black/60">Loading items…</p>;
  if (isError) return <p className="text-sm text-black/60">Items could not be loaded.</p>;

  const allItems = data?.pages.flatMap((page) => page.features) ?? [];
  if (!allItems.length)
    return <p className="text-sm text-black/60">This collection has no items.</p>;

  const items = filter
    ? allItems.filter((item) =>
        `${item.id} ${String(item.properties?.title ?? '')}`.toLowerCase().includes(filter)
      )
    : allItems;

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-bold tracking-wide text-black/85 uppercase">Items</h2>
      {!items.length && (
        <p className="text-sm text-black/60">
          No loaded items match your search.
          {hasNextPage && ' Try loading more.'}
        </p>
      )}
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const thumbnail = getItemThumbnail(item);
          const href = getSelfHref(item, itemsUrl);
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => href && onNavigate(href)}
                disabled={!href}
                className="focus-visible:ring-brand-800 hover:border-brand-800/40 w-full overflow-hidden rounded-xl border border-black/10 bg-white text-left shadow-sm transition hover:shadow-md focus-visible:ring-2 focus-visible:outline-none disabled:cursor-default"
              >
                {thumbnail && (
                  // eslint-disable-next-line @next/next/no-img-element -- arbitrary external hosts, not configurable in next/image
                  <img src={thumbnail} alt="" loading="lazy" className="h-32 w-full object-cover" />
                )}
                <div className="space-y-1 px-4 py-3">
                  <p className="notranslate truncate text-sm font-semibold text-black/85">
                    {item.id}
                  </p>
                  {item.properties?.datetime && (
                    <p className="notranslate text-xs text-black/60">
                      {formatDatetime(item.properties.datetime)}
                    </p>
                  )}
                </div>
              </button>
            </li>
          );
        })}
      </ul>
      {hasNextPage && (
        <button
          type="button"
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="text-brand-800 border-brand-800/40 hover:bg-brand-800/5 rounded-full border px-5 py-2 text-sm font-semibold transition disabled:opacity-50"
        >
          {isFetchingNextPage ? 'Loading…' : 'Load more'}
        </button>
      )}
    </section>
  );
}
