import Link from 'next/link';

import type { StacCollection } from './types';
import { formatTemporalExtent } from './utils';

export default function CollectionCard({ collection }: { collection: StacCollection }) {
  const temporalExtent = formatTemporalExtent(collection.extent);

  return (
    <Link
      href={`/catalog/${collection.id}`}
      className="focus-visible:ring-brand-800 flex h-full flex-col gap-2 rounded-2xl border border-black/10 bg-white p-6 shadow-sm transition hover:shadow-md focus-visible:ring-2 focus-visible:outline-none"
    >
      <h3 className="text-base font-bold text-black/85">{collection.title ?? collection.id}</h3>
      <p className="line-clamp-3 text-sm text-black/70">{collection.description}</p>
      {temporalExtent && (
        <p className="notranslate mt-auto pt-2 text-xs text-black/60">{temporalExtent}</p>
      )}
      {!!collection.keywords?.length && (
        <ul className="flex flex-wrap gap-1.5">
          {collection.keywords.slice(0, 4).map((keyword) => (
            <li
              key={keyword}
              className="bg-brand-800/10 text-brand-800 rounded-full px-2.5 py-0.5 text-xs font-semibold"
            >
              {keyword}
            </li>
          ))}
        </ul>
      )}
    </Link>
  );
}
