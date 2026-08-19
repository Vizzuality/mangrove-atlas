import Link from 'next/link';

export default function CatalogHeader() {
  return (
    <header className="border-b border-black/10 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <Link href="/catalog" className="text-brand-800 text-lg font-bold">
            Data Catalog
          </Link>
          <span className="text-sm text-black/60">Global Mangrove Watch</span>
        </div>
        <Link
          href="/"
          className="text-brand-800 text-sm font-semibold underline hover:no-underline"
        >
          Back to the map
        </Link>
      </div>
    </header>
  );
}
