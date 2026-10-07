import { COOKIE_CONSENT_NAME } from '@/lib/analytics/consent';

import { welcomeMessageOpenAtom } from '@/store/welcome-message';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider, createStore } from 'jotai';

import CookieBanner from '@/components/cookie-banner';

const pathname = vi.hoisted(() => ({ current: '/' }));
vi.mock('next/navigation', () => ({ usePathname: () => pathname.current }));

function renderBanner(store = createStore()) {
  // Fresh Jotai store per render so the consent atom does not leak across tests.
  return render(
    <Provider store={store}>
      <CookieBanner />
    </Provider>
  );
}

beforeEach(() => {
  pathname.current = '/';
  document.cookie = `${COOKIE_CONSENT_NAME}=; Max-Age=0; Path=/`;
});

describe('CookieBanner', () => {
  it('shows the notice with both choices when no decision is stored', async () => {
    renderBanner();

    const region = await screen.findByRole('region', { name: /cookie consent/i });
    expect(region).toHaveTextContent(/we use cookies to make this service work/i);
    expect(screen.getByRole('button', { name: 'Accept all cookies' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Reject non-essential cookies' })
    ).toBeInTheDocument();
  });

  it('accepting stores the choice and dismisses the banner', async () => {
    const user = userEvent.setup();
    renderBanner();

    await user.click(await screen.findByRole('button', { name: 'Accept all cookies' }));

    expect(screen.queryByRole('region', { name: /cookie consent/i })).not.toBeInTheDocument();
    expect(document.cookie).toContain(`${COOKIE_CONSENT_NAME}=accepted`);
  });

  it('rejecting stores the choice and dismisses the banner', async () => {
    const user = userEvent.setup();
    renderBanner();

    await user.click(await screen.findByRole('button', { name: 'Reject non-essential cookies' }));

    expect(screen.queryByRole('region', { name: /cookie consent/i })).not.toBeInTheDocument();
    expect(document.cookie).toContain(`${COOKIE_CONSENT_NAME}=rejected`);
  });

  it('stays hidden when a decision was already made', async () => {
    document.cookie = `${COOKIE_CONSENT_NAME}=rejected; Path=/`;
    renderBanner();

    // Give the mount effect a tick to read the cookie.
    await Promise.resolve();
    expect(screen.queryByRole('region', { name: /cookie consent/i })).not.toBeInTheDocument();
  });

  it('waits for the welcome dialog to close before asking', async () => {
    const store = createStore();
    store.set(welcomeMessageOpenAtom, true);
    renderBanner(store);

    await Promise.resolve();
    expect(screen.queryByRole('region', { name: /cookie consent/i })).not.toBeInTheDocument();

    store.set(welcomeMessageOpenAtom, false);
    expect(await screen.findByRole('region', { name: /cookie consent/i })).toBeInTheDocument();
  });

  it('is not rendered on embedded or print routes', async () => {
    pathname.current = '/embedded/country/IDN';
    renderBanner();
    await Promise.resolve();
    expect(screen.queryByRole('region', { name: /cookie consent/i })).not.toBeInTheDocument();
  });
});
