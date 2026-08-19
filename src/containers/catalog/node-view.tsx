'use client';

import { useCallback, useState } from 'react';

import Link from 'next/link';

import { parseAsString, useQueryState } from 'nuqs';

import AssetList from './asset-list';
import { useCatalog, useStacNode } from './hooks';
import ItemDetail from './item-detail';
import ItemsGrid from './items-grid';
import NodeChildren from './node-children';
import PreviewMap from './preview-map';
import type { StacCollection } from './types';
import {
  formatTemporalExtent,
  getChildLinks,
  getItemLinks,
  getItemsHref,
  getLinkHref,
  linkLabel,
  resolveHref,
} from './utils';

function CollectionMeta({ collection }: { collection: StacCollection }) {
  const temporalExtent = formatTemporalExtent(collection.extent);
  const bbox = collection.extent?.spatial?.bbox?.[0];

  return (
    <div className="space-y-2">
      {collection.description && (
        <p className="max-w-3xl text-sm text-black/70">{collection.description}</p>
      )}
      <dl className="flex flex-wrap gap-x-8 gap-y-1 text-sm text-black/60">
        {collection.license && (
          <div className="flex gap-2">
            <dt className="font-semibold">License</dt>
            <dd className="notranslate">{collection.license}</dd>
          </div>
        )}
        {temporalExtent && (
          <div className="flex gap-2">
            <dt className="font-semibold">Temporal extent</dt>
            <dd className="notranslate">{temporalExtent}</dd>
          </div>
        )}
        {bbox && (
          <div className="flex gap-2">
            <dt className="font-semibold">Bounding box</dt>
            <dd className="notranslate">{bbox.map((v) => v.toFixed(2)).join(', ')}</dd>
          </div>
        )}
      </dl>
      {!!collection.keywords?.length && (
        <ul className="flex flex-wrap gap-1.5">
          {collection.keywords.map((keyword) => (
            <li
              key={keyword}
              className="bg-brand-800/10 text-brand-800 rounded-full px-2.5 py-0.5 text-xs font-semibold"
            >
              {keyword}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function NodeView({ slug }: { slug: string }) {
  const { data: catalog, isLoading: isCatalogLoading } = useCatalog(slug);
  const [nodeUrl, setNodeUrl] = useQueryState('n', parseAsString);
  const [search, setSearch] = useState('');
  const currentUrl = nodeUrl ?? catalog?.url ?? null;
  const { data: node, isLoading, isError } = useStacNode(currentUrl);

  const navigate = useCallback(
    (href: string) => {
      if (!currentUrl) return;
      setSearch(''); // a search only applies to the node it was typed on
      void setNodeUrl(resolveHref(href, currentUrl));
    },
    [currentUrl, setNodeUrl]
  );

  const goToRoot = useCallback(() => {
    setSearch('');
    void setNodeUrl(null);
  }, [setNodeUrl]);

  if (isCatalogLoading) {
    return <p className="animate-pulse text-sm text-black/60">Loading catalog…</p>;
  }
  if (!catalog) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-black/60">This catalog could not be found.</p>
        <Link href="/catalog" className="text-brand-800 text-sm font-semibold underline">
          Back to all catalogs
        </Link>
      </div>
    );
  }

  const rootHref = node && currentUrl ? getLinkHref(node, 'root', currentUrl) : null;
  const parentHref = node && currentUrl ? getLinkHref(node, 'parent', currentUrl) : null;
  const isAtRoot = !nodeUrl || nodeUrl === catalog.url;

  const title =
    node && 'title' in node && node.title
      ? node.title
      : (node && 'id' in node && String(node.id)) || catalog.title;

  return (
    <div className="space-y-8">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm">
        <Link href="/catalog" className="text-brand-800 font-semibold underline hover:no-underline">
          All catalogs
        </Link>
        <span className="text-black/40">/</span>
        {isAtRoot ? (
          <span className="font-semibold text-black/85">{catalog.title}</span>
        ) : (
          <>
            <button
              type="button"
              onClick={goToRoot}
              className="text-brand-800 font-semibold underline hover:no-underline"
            >
              {catalog.title}
            </button>
            {parentHref && parentHref !== rootHref && (
              <>
                <span className="text-black/40">/</span>
                <button
                  type="button"
                  onClick={() => navigate(parentHref)}
                  className="text-brand-800 font-semibold underline hover:no-underline"
                >
                  Parent
                </button>
              </>
            )}
          </>
        )}
      </nav>

      {isLoading && <p className="animate-pulse text-sm text-black/60">Loading…</p>}
      {isError && (
        <p className="text-sm text-black/60">
          This STAC node could not be loaded. It may be offline or blocking cross-origin requests.
        </p>
      )}

      {node && currentUrl && (
        <>
          {node.type !== 'Feature' && (
            <div className="space-y-4">
              <h1 className="text-xl font-bold text-black/85">{title}</h1>
              {node.type === 'Catalog' && node.description && (
                <p className="max-w-3xl text-sm text-black/70">{node.description}</p>
              )}
              {node.type === 'Collection' && <CollectionMeta collection={node} />}
            </div>
          )}

          {node.type === 'Feature' ? (
            <ItemDetail item={node} />
          ) : (
            <>
              {node.type === 'Collection' && (
                <PreviewMap
                  key={node.id}
                  bbox={node.extent?.spatial?.bbox?.[0]}
                  tileAssets={node.assets}
                />
              )}
              {'assets' in node && node.assets && <AssetList assets={node.assets} />}
              {(() => {
                const query = search.trim().toLowerCase();
                const matchesQuery = (label: string) =>
                  !query || label.toLowerCase().includes(query);
                const childLinks = getChildLinks(node).filter((link) =>
                  matchesQuery(linkLabel(link))
                );
                const itemLinks = getItemLinks(node).filter((link) =>
                  matchesQuery(linkLabel(link))
                );
                const hasBrowsableContent =
                  getChildLinks(node).length ||
                  getItemLinks(node).length ||
                  getItemsHref(node, currentUrl);

                return (
                  <>
                    {!!hasBrowsableContent && (
                      <input
                        type="search"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search in this catalog…"
                        aria-label="Search collections and items"
                        className="focus-visible:ring-brand-800 w-full max-w-xs rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-black/85 placeholder:text-black/40 focus-visible:ring-2 focus-visible:outline-none"
                      />
                    )}
                    <NodeChildren
                      title={node.type === 'Catalog' ? 'Catalogs & collections' : 'Sub-collections'}
                      links={childLinks}
                      onNavigate={navigate}
                    />
                    {query && getChildLinks(node).length > 0 && !childLinks.length && (
                      <p className="text-sm text-black/60">No collections match your search.</p>
                    )}
                    {/* Static catalogs list items as `item` links; STAC APIs expose an `items` endpoint. */}
                    <NodeChildren title="Items" links={itemLinks} onNavigate={navigate} />
                    {(() => {
                      const itemsHref = getItemsHref(node, currentUrl);
                      return itemsHref && !getItemLinks(node).length ? (
                        <ItemsGrid itemsUrl={itemsHref} onNavigate={navigate} filter={query} />
                      ) : null;
                    })()}
                  </>
                );
              })()}
            </>
          )}
        </>
      )}
    </div>
  );
}
