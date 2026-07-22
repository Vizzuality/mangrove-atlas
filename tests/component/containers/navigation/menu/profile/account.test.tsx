import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// next-auth session: an authenticated user with an organization and one role.
// `update` is what the account form calls to reflect saved edits back into the
// client session, so we assert against it.
const updateSessionMock = vi.fn().mockResolvedValue(undefined);
const sessionData = {
  user: {
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    organization: 'Old Org',
    roles: ['scientist'],
    other_role: null,
    accessToken: 'test-token',
  },
};

vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: sessionData, update: updateSessionMock, status: 'authenticated' }),
  signOut: vi.fn(),
}));

// Mock only the network call; the real react-query hook + onSuccess/updateSession
// path runs so we exercise the actual mapping from form values to API payload.
const updateUserMock = vi.fn().mockResolvedValue({ ok: true });
vi.mock('services/auth', async (importOriginal) => {
  const actual = (await importOriginal()) as typeof import('services/auth');
  return { ...actual, updateUser: (...args: unknown[]) => updateUserMock(...args) };
});

import AccountContent from '@/containers/navigation/menu/profile/account';

beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
  // Radix popover (RolesSelect) touches these in jsdom.
  if (!Element.prototype.hasPointerCapture) Element.prototype.hasPointerCapture = () => false;
  if (!Element.prototype.setPointerCapture) Element.prototype.setPointerCapture = () => {};
  if (!Element.prototype.releasePointerCapture) Element.prototype.releasePointerCapture = () => {};
  if (!Element.prototype.scrollIntoView) Element.prototype.scrollIntoView = () => {};
});

beforeEach(() => {
  updateUserMock.mockClear();
  updateSessionMock.mockClear();
});

function renderAccount() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <AccountContent />
    </QueryClientProvider>
  );
}

describe('AccountContent — profile update', () => {
  it('saves a new organization and preserves the existing roles', async () => {
    const user = userEvent.setup();
    renderAccount();

    const org = screen.getByPlaceholderText('Organization');
    await user.clear(org);
    await user.type(org, 'New Org');

    await user.click(screen.getByRole('button', { name: /save changes/i }));

    await waitFor(() => expect(updateUserMock).toHaveBeenCalledTimes(1));

    const payload = updateUserMock.mock.calls[0][0] as {
      user: { organization?: string; user_roles?: string[] };
    };
    expect(payload.user.organization).toBe('New Org');
    expect(payload.user.user_roles).toEqual(['scientist']);
    // No password change → credentials must not be sent.
    expect(payload.user).not.toHaveProperty('password');

    await waitFor(() =>
      expect(updateSessionMock).toHaveBeenCalledWith(
        expect.objectContaining({ organization: 'New Org', roles: ['scientist'] })
      )
    );
  });

  it('adds a newly selected role to the saved user_roles', async () => {
    const user = userEvent.setup();
    renderAccount();

    // Open the roles dropdown (trigger shows the current selection label).
    await user.click(screen.getByRole('button', { name: /scientist/i }));
    await user.click(await screen.findByRole('option', { name: 'NGO' }));
    // The RolesSelect popover is modal (aria-hides the rest of the tree); close
    // it so the Save button is back in the accessibility tree and enabled.
    await user.keyboard('{Escape}');

    await user.click(await screen.findByRole('button', { name: /save changes/i }));

    await waitFor(() => expect(updateUserMock).toHaveBeenCalledTimes(1));

    const payload = updateUserMock.mock.calls[0][0] as { user: { user_roles?: string[] } };
    expect(payload.user.user_roles).toEqual(expect.arrayContaining(['scientist', 'ngo']));
  });

  it('sends the free-text role under user_role_other (the key the backend expects)', async () => {
    const user = userEvent.setup();
    renderAccount();

    await user.click(screen.getByRole('button', { name: /scientist/i }));
    await user.click(await screen.findByRole('option', { name: 'Other' }));
    await user.keyboard('{Escape}');

    await user.type(screen.getByPlaceholderText('Tell us your role'), 'Park Ranger');
    await user.click(await screen.findByRole('button', { name: /save changes/i }));

    await waitFor(() => expect(updateUserMock).toHaveBeenCalledTimes(1));

    const payload = updateUserMock.mock.calls[0][0] as { user: Record<string, unknown> };
    expect(payload.user.user_role_other).toBe('Park Ranger');
    // Regression guard: the old (wrong) key must never be sent.
    expect(payload.user).not.toHaveProperty('user_other_role');
  });
});
