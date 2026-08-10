import { notFound } from 'next/navigation';

import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';
import turfBbox from '@turf/bbox';
import type { Metadata } from 'next';

import { locationQueryOptions, type DataResponse } from '@/containers/datasets/locations/hooks';
import MainApp from '@/containers/main-app';

const ALLOWED_LOCATION_TYPES = ['custom-area', 'country', 'wdpa'];

const DESCRIPTION =
  'Global Mangrove Watch (GMW) is an online platform that provides the remote sensing data and tools for monitoring mangroves necessary for this. It gives universal access to near real-time information on where and what changes there are to mangroves across the world, and highlights why they are valuable.';

/**
 * Resolve the page title from the location in the URL.
 *
 * Every route under this catch-all previously shipped the same static title,
 * so `/country/IDN` and the worldwide view were indistinguishable in the
 * browser tab, in history, and to a screen reader announcing the page. This
 * reuses the same prefetch the page itself performs — React Query dedupes the
 * request, so it costs nothing extra.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ params?: string[] }>;
}): Promise<Metadata> {
  const { params: urlParams } = await params;
  const locationType = urlParams?.[0];
  const locationId = urlParams?.[1];

  let title = 'Worldwide';

  if (locationType && ALLOWED_LOCATION_TYPES.includes(locationType) && locationId) {
    const queryClient = new QueryClient();
    try {
      const { data } = await queryClient.fetchQuery(locationQueryOptions(locationType, locationId));
      if (data?.name) title = data.name;
    } catch {
      // Leave the default; the page itself decides whether this is a 404.
    }
  }

  return {
    title,
    description: DESCRIPTION,
    openGraph: {
      title: `${title} | Global Mangrove Watch`,
      description: DESCRIPTION,
      type: 'website',
    },
  };
}

export default async function Page({ params }: { params: Promise<{ params?: string[] }> }) {
  const { params: urlParams } = await params;
  const locationType = urlParams?.[0];
  const locationId = urlParams?.[1];

  if (locationType && !ALLOWED_LOCATION_TYPES.includes(locationType)) {
    notFound();
  }

  const queryClient = new QueryClient();

  if (locationId) {
    try {
      await queryClient.prefetchQuery(locationQueryOptions(locationType, locationId));

      const cached = queryClient.getQueryData<{ data: DataResponse['data'][0] }>([
        'location',
        locationType,
        locationId,
      ]);

      if (cached?.data?.bounds) {
        queryClient.setQueryData(['location-bounds'], turfBbox(cached.data.bounds));
      }
    } catch {
      notFound();
    }
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MainApp />
    </HydrationBoundary>
  );
}
