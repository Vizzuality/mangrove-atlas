'use client';

import LanguageSelector from '@/containers/navigation/language-selector';

import Link from 'next/link';
import Helper from '@/containers/help/helper';
import HelpContainer from '@/containers/help';

export default function LandingNavigation() {
  return (
    <header className="relative mx-auto flex w-full items-center justify-end px-4 py-4">
      <nav className="text-brand-800 flex items-center gap-6 text-sm font-semibold">
        <button type="button">About</button>
        <div className="flex h-full items-center justify-center">
          <Helper
            className={{
              button: '-top-2.5 -right-4 z-20',
              tooltip: 'w-fit-content',
            }}
            tooltipPosition={{ top: -40, left: 0 }}
            message="Contact the GMW team or activate a tour of the platform."
          >
            <HelpContainer
              theme="dark"
              hasArrow={true}
              className="rounded-3xl border border-white px-2 hover:border-gray-200"
            />
          </Helper>
        </div>
        <Link
          href="https://tnc.box.com/s/pspea7mm2m2uldrqvhahmvp9dck6mc06"
          target="_blank"
          rel="noopener noreferrer"
          className="whitespace-nowrap"
        >
          User guide
        </Link>

        <LanguageSelector
          theme="dark"
          hasArrow={true}
          className="rounded-3xl border border-white px-2 hover:border-gray-200"
        />
      </nav>
    </header>
  );
}
