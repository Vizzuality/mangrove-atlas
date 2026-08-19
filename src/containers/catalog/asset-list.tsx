'use client';

import { useState } from 'react';

import type { StacAsset } from './types';
import { assetKindLabel, assetViewerUrl, isDownloadableAsset, safeHref } from './utils';

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        void navigator.clipboard.writeText(value).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
      }}
      className="text-brand-800 border-brand-800/40 hover:bg-brand-800/5 rounded-full border px-3 py-1 text-xs font-semibold transition"
    >
      {copied ? 'Copied!' : 'Copy URL'}
    </button>
  );
}

type AssetListProps = {
  title?: string;
  assets: Record<string, StacAsset>;
};

export default function AssetList({ title = 'Assets', assets }: AssetListProps) {
  const entries = Object.entries(assets ?? {});
  if (!entries.length) return null;

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-bold tracking-wide text-black/85 uppercase">{title}</h2>
      <ul className="space-y-2">
        {entries.map(([key, asset]) => {
          const kind = assetKindLabel(asset);
          const viewerUrl = assetViewerUrl(asset);
          const downloadHref = isDownloadableAsset(asset) ? safeHref(asset.href) : null;
          return (
            <li
              key={key}
              className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-black/10 bg-white px-4 py-3 shadow-sm"
            >
              <div className="min-w-0 flex-1 space-y-0.5">
                <p className="text-sm font-semibold text-black/85">
                  {asset.title ?? key}
                  {kind && (
                    <span className="bg-brand-800/10 text-brand-800 ml-2 rounded-full px-2 py-0.5 text-xs font-semibold">
                      {kind}
                    </span>
                  )}
                  {asset.roles?.map((role) => (
                    <span
                      key={role}
                      className="ml-2 rounded-full bg-black/5 px-2 py-0.5 text-xs font-semibold text-black/60"
                    >
                      {role}
                    </span>
                  ))}
                </p>
                <p className="notranslate truncate text-xs text-black/50" title={asset.href}>
                  {asset.href}
                </p>
                {asset.type && <p className="notranslate text-xs text-black/40">{asset.type}</p>}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <CopyButton value={asset.href} />
                {viewerUrl && (
                  <a
                    href={viewerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-800 border-brand-800/40 hover:bg-brand-800/5 rounded-full border px-3 py-1 text-xs font-semibold transition"
                  >
                    View
                  </a>
                )}
                {/* Tile templates aren't fetchable documents — only offer download for real files. */}
                {downloadHref && (
                  <a
                    href={downloadHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="bg-brand-800 hover:bg-brand-800/90 rounded-full px-3 py-1 text-xs font-semibold text-white transition"
                  >
                    Download
                  </a>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
