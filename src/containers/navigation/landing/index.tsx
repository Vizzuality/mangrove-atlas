'use client';

import Link from 'next/link';

import { PRIVACY_NOTICE_URL } from '@/lib/legal';

import Contact from '@/containers/contact';
import LanguageSelector from '@/containers/navigation/language-selector';

export default function LandingNavigation() {
  return (
    <header className="relative mx-auto flex w-full items-center justify-end px-4 py-4">
      <nav className="text-brand-800 flex items-center gap-6 text-sm font-semibold">
        <Link href={PRIVACY_NOTICE_URL} className="whitespace-nowrap hover:underline">
          Privacy Notice
        </Link>

        <Contact className="cursor-pointer whitespace-nowrap hover:underline" />

        <LanguageSelector
          theme="dark"
          hasArrow={true}
          className="text-brand-800 rounded-3xl border border-white px-2 hover:border-gray-200"
        />
      </nav>
    </header>
  );
}
