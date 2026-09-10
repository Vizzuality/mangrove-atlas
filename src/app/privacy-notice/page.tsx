import type { Metadata } from 'next';

import Logo from 'components/logo';

import Content from './content.mdx';

export const metadata: Metadata = {
  title: 'Privacy Notice',
};

export default function PrivacyNoticePage() {
  return (
    <div className="relative min-h-screen bg-white">
      <Logo position="top-left" width={360} />
      {/* id="main-content" is the target of the root layout's skip link. */}
      <main id="main-content" className="mx-auto w-full max-w-3xl px-6 pt-40 pb-24">
        <article className="prose prose-neutral prose-headings:font-sans prose-h1:text-4xl prose-h1:font-light prose-h1:text-brand-800 prose-h2:text-xl prose-h2:font-bold prose-h3:text-base prose-h3:font-semibold prose-a:text-brand-800 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline prose-th:text-left prose-th:align-bottom prose-td:align-top max-w-none font-sans text-black/85">
          <Content />
        </article>
      </main>
    </div>
  );
}
