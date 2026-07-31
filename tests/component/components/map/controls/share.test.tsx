import { render, screen, waitFor } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';

import Share from '@/components/map/controls/share';
import { TooltipProvider } from '@/components/ui/tooltip';

/**
 * These assert on the URL the dialog *copies*, not on how it renders — the field is
 * `truncate`d by design, so visual clipping is expected and irrelevant. What matters is that
 * the clipboard receives the full current view.
 *
 * The clipboard is `userEvent.setup()`'s own stub, read back with `readText()`. Don't replace
 * `navigator.clipboard` with a spy here: setup() overwrites it, so the spy never sees the write.
 */

const ORIGIN = 'http://localhost:3000';

afterEach(() => {
  window.history.replaceState({}, '', '/');
});

/** Navigate the way nuqs does — history only, no Next router involvement. */
function goTo(path: string) {
  window.history.replaceState({}, '', path);
}

/** The tooltip on the trigger needs the provider the root layout supplies in the real app. */
function renderShare() {
  return render(
    <TooltipProvider>
      <Share disabled={false} />
    </TooltipProvider>
  );
}

/**
 * `pointerEventsCheck: 0` because Radix's modal sets `pointer-events: none` on the body while a
 * dialog is up and clears it asynchronously on close; user-event would otherwise refuse the next
 * click. findByRole rather than getByRole for the same reason — the content mounts and unmounts.
 */
function setupUser() {
  return userEvent.setup({ pointerEventsCheck: 0 });
}

async function openShareDialog(user: UserEvent) {
  await user.click(await screen.findByRole('button', { name: 'Share' }));
  await screen.findByRole('dialog');
}

async function closeShareDialog(user: UserEvent) {
  await user.keyboard('{Escape}');
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
}

async function copy(user: UserEvent, button: 'Copy link' | 'Copy code') {
  await user.click(await screen.findByRole('button', { name: button }));
  return navigator.clipboard.readText();
}

describe('Share dialog', () => {
  it('copies the current location, not the one the control mounted with', async () => {
    const user = setupUser();
    renderShare();

    // Mounted at `/`, then navigated — this is the case that was broken: the copied link kept
    // pointing at the root, so a recipient never landed on the country the sharer was viewing.
    goTo('/country/IDN?active-widgets=mangrove_habitat_extent');
    await openShareDialog(user);

    expect(await copy(user, 'Copy link')).toBe(
      `${ORIGIN}/country/IDN?active-widgets=mangrove_habitat_extent`
    );
  });

  it('builds an embed URL that keeps the path separator', async () => {
    const user = setupUser();
    renderShare();

    goTo('/country/IDN?active-widgets=mangrove_habitat_extent');
    await openShareDialog(user);

    // Regression guard: this used to drop the leading slash and produce
    // `/embeddedcountry/IDN`, which is not a route.
    expect(await copy(user, 'Copy code')).toBe(
      `<iframe src="${ORIGIN}/embedded/country/IDN?active-widgets=mangrove_habitat_extent" title="Global Mangrove Watch"></iframe>`
    );
  });

  it('embeds the bare route at the root, without a trailing slash', async () => {
    const user = setupUser();
    renderShare();

    goTo('/');
    await openShareDialog(user);

    expect(await copy(user, 'Copy code')).toBe(
      `<iframe src="${ORIGIN}/embedded" title="Global Mangrove Watch"></iframe>`
    );
  });

  it('re-reads the location each time it opens', async () => {
    const user = setupUser();
    renderShare();

    goTo('/country/IDN');
    await openShareDialog(user);
    expect(await copy(user, 'Copy link')).toBe(`${ORIGIN}/country/IDN`);

    await closeShareDialog(user);

    goTo('/country/BRA');
    await openShareDialog(user);

    // Asserted on the displayed value rather than by copying again: the button is still labelled
    // "Copied" from the first copy (a 5s timeout that outlives the dialog). Display and clipboard
    // read the same snapshot, and the tests above already cover the clipboard path.
    expect(await screen.findByText(`${ORIGIN}/country/BRA`)).toBeInTheDocument();
  });
});
