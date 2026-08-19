'use client';

import AssetList from './asset-list';
import PreviewMap from './preview-map';
import type { StacItem } from './types';
import { formatDatetime, getItemThumbnail, prettifyPropertyKey } from './utils';

const HIDDEN_PROPERTIES = new Set(['datetime']);

function propertyValue(value: unknown) {
  if (value == null) return null;
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  if (Array.isArray(value) && value.every((v) => typeof v === 'string' || typeof v === 'number')) {
    return value.join(', ');
  }
  return null;
}

export default function ItemDetail({ item }: { item: StacItem }) {
  const thumbnail = getItemThumbnail(item);
  const properties = Object.entries(item.properties ?? {})
    .filter(([key]) => !HIDDEN_PROPERTIES.has(key))
    .map(([key, value]) => [key, propertyValue(value)] as const)
    .filter(([, value]) => value !== null);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start gap-6">
        {thumbnail && (
          // eslint-disable-next-line @next/next/no-img-element -- arbitrary external hosts, not configurable in next/image
          <img
            src={thumbnail}
            alt=""
            className="h-48 w-72 rounded-xl border border-black/10 object-cover shadow-sm"
          />
        )}
        <div className="min-w-0 flex-1 space-y-1">
          <h1 className="notranslate text-xl font-bold break-words text-black/85">{item.id}</h1>
          {item.collection && (
            <p className="text-sm text-black/60">
              Collection: <span className="notranslate">{item.collection}</span>
            </p>
          )}
          {item.properties?.datetime && (
            <p className="notranslate text-sm text-black/60">
              {formatDatetime(item.properties.datetime)}
            </p>
          )}
        </div>
      </div>

      <PreviewMap
        key={item.id}
        bbox={item.bbox}
        geometry={item.geometry}
        tileAssets={item.assets}
      />

      <AssetList assets={item.assets} />

      {!!properties.length && (
        <section className="space-y-3">
          <h2 className="text-sm font-bold tracking-wide text-black/85 uppercase">Properties</h2>
          <dl className="grid gap-x-8 gap-y-2 rounded-xl border border-black/10 bg-white px-4 py-3 shadow-sm sm:grid-cols-2">
            {properties.map(([key, value]) => (
              <div key={key} className="flex items-baseline justify-between gap-4 text-sm">
                <dt className="shrink-0 font-semibold text-black/70">{prettifyPropertyKey(key)}</dt>
                <dd className="notranslate truncate text-black/60" title={value ?? undefined}>
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}
    </div>
  );
}
