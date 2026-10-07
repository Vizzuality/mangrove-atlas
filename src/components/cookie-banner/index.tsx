'use client';

import { usePathname } from 'next/navigation';

import { useCookieConsent } from '@/store/cookie-consent';
import { welcomeMessageOpenAtom } from '@/store/welcome-message';

import { useAtomValue } from 'jotai';

import { Button } from '@/components/ui/button';

// Routes that are embedded in third-party pages or rendered for print: the
// host page (or the printer) is the wrong place to ask for consent.
const HIDDEN_PATH_PREFIXES = ['/embedded', '/print-report'];

const CookieBanner = () => {
  const pathname = usePathname();
  const { consent, setConsent } = useCookieConsent();
  const welcomeOpen = useAtomValue(welcomeMessageOpenAtom);

  if (consent !== null) return null;
  // The welcome dialog is modal; shown together the banner would be aria-hidden
  // and outside its focus trap. Ask once that is dismissed.
  if (welcomeOpen) return null;
  if (HIDDEN_PATH_PREFIXES.some((prefix) => pathname?.startsWith(prefix))) return null;

  return (
    <section
      aria-label="Cookie consent"
      className="bg-brand-800 fixed inset-x-0 bottom-0 z-70 flex flex-col gap-4 p-4 font-sans text-white shadow-[0_-4px_12px_rgba(0,0,0,0.08)] sm:flex-row sm:items-center sm:gap-8 print:hidden"
    >
      <p className="flex-1 text-[13px] leading-snug font-bold">
        We use cookies to make this service work. The essential cookies always need to be on because
        they are necessary for core functionality.
      </p>
      <div className="flex flex-wrap items-center gap-4">
        <Button
          type="button"
          variant="secondary"
          className="rounded-[32px] font-semibold"
          onClick={() => setConsent('accepted')}
        >
          Accept all cookies
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="rounded-[32px] font-semibold"
          onClick={() => setConsent('rejected')}
        >
          Reject non-essential cookies
        </Button>
      </div>
    </section>
  );
};

export default CookieBanner;
