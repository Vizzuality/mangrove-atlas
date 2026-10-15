import { analysisAtom } from '@/store/analysis';
import { customAreaLabelAtom, drawingUploadToolAtom } from '@/store/drawing-tool';
import { tmpCameraAtom } from '@/store/map';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createStore, Provider } from 'jotai';

const replaceState = vi.fn();

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('next-auth/react', () => ({
  getSession: vi.fn().mockResolvedValue({ user: { accessToken: 'test-token' } }),
}));

const square = {
  type: 'Polygon' as const,
  coordinates: [
    [
      [0, 0],
      [2, 0],
      [2, 1],
      [0, 1],
      [0, 0],
    ],
  ],
};

const sites = [
  { id: 1, site_name: 'Mangrove Creek', landscape_id: 10, landscape_name: 'Delta' },
  { id: 2, site_name: 'Undrawn Site', landscape_id: 10, landscape_name: 'Delta' },
  { id: 3, site_name: 'Bay Site', landscape_id: 20, landscape_name: 'Bay' },
];

const widgetSites = {
  data: [
    { id: 1, site_area: JSON.stringify(square) },
    { id: 2, site_area: null },
    { id: 3, site_area: JSON.stringify(square) },
  ],
};

const requestMock = vi.fn();
vi.mock('services/api', () => ({
  default: { request: (...args: unknown[]) => requestMock(...args) },
}));

import UserMRTTSites from '@/containers/navigation/menu/profile/saved-areas/sites';

import { TooltipProvider } from '@/components/ui/tooltip';

beforeEach(() => {
  requestMock.mockReset();
  requestMock.mockImplementation(({ url }: { url: string }) => {
    if (url === '/sites') return Promise.resolve({ data: sites });
    if (url === '/widgets/sites') return Promise.resolve({ data: widgetSites });
    return Promise.reject(new Error(`unexpected url ${url}`));
  });
  replaceState.mockClear();
  vi.spyOn(window.history, 'replaceState').mockImplementation(replaceState);
});

function renderSites(store = createStore()) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(
    <Provider store={store}>
      <QueryClientProvider client={client}>
        <TooltipProvider>
          <UserMRTTSites />
        </TooltipProvider>
      </QueryClientProvider>
    </Provider>
  );
  return store;
}

describe('UserMRTTSites', () => {
  it('lists the sites grouped by landscape, in a dedicated section', async () => {
    renderSites();

    expect(await screen.findByRole('list', { name: 'Sites in Delta' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'MRTT sites' })).toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'Sites in Bay' })).toBeInTheDocument();
    expect(screen.getByText('Mangrove Creek')).toBeInTheDocument();
  });

  it('never offers a delete action for MRTT sites', async () => {
    renderSites();
    await screen.findByText('Mangrove Creek');
    expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
  });

  it('links every site to its MRTT overview page', async () => {
    renderSites();
    const link = await screen.findByRole('link', { name: /Open Mangrove Creek in the MRTT/ });
    expect(link).toHaveAttribute('href', expect.stringMatching(/\/sites\/1\/overview$/));
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('selecting a site feeds its polygon to the analysis pipeline and navigates to /custom-area', async () => {
    const user = userEvent.setup();
    const store = renderSites();

    await user.click(await screen.findByRole('button', { name: 'Analyse site Mangrove Creek' }));

    await waitFor(() => expect(store.get(analysisAtom).enabled).toBe(true));
    const upload = store.get(drawingUploadToolAtom);
    expect(upload.uploadedGeojson?.features[0].geometry).toEqual(square);
    expect(upload.customGeojson).toBeNull();
    expect(store.get(tmpCameraAtom)).toEqual({ bbox: [0, 0, 2, 1] });
    // The route stays /custom-area but the title shows the site name.
    expect(store.get(customAreaLabelAtom)).toBe('Mangrove Creek');
    expect(replaceState).toHaveBeenCalledWith(null, '', '/custom-area');
  });

  it('renders a site without a drawn area as plain text, not a button', async () => {
    renderSites();
    await screen.findByText('Undrawn Site');
    expect(screen.queryByRole('button', { name: 'Analyse site Undrawn Site' })).toBeNull();
  });

  it('renders nothing when the user has no MRTT sites', async () => {
    requestMock.mockImplementation(({ url }: { url: string }) =>
      Promise.resolve({ data: url === '/sites' ? [] : { data: [] } })
    );
    renderSites();
    await waitFor(() => expect(requestMock).toHaveBeenCalled());
    await waitFor(() =>
      expect(screen.queryByRole('heading', { name: 'MRTT sites' })).not.toBeInTheDocument()
    );
  });
});
