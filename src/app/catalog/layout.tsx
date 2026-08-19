import type { Metadata } from 'next';

import CatalogHeader from '@/containers/catalog/header';

export const metadata: Metadata = {
  title: 'Data Catalog',
};

export default function CatalogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <CatalogHeader />
      <main id="main-content" className="mx-auto max-w-6xl px-6 py-8">
        {children}
      </main>
    </div>
  );
}
