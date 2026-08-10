import { notFound } from 'next/navigation';

import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';
import turfBbox from '@turf/bbox';
import type { Metadata } from 'next';

import { locationQueryOptions, type DataResponse } from '@/containers/datasets/locations/hooks';
import EmbeddedWrapper from '@/containers/embedded/wrapper';

const ALLOWED_LOCATION_TYPES = ['custom-area', 'country', 'wdpa'];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ params?: string[] }>;
}): Promise<Metadata> {
  const { params: urlParams } = await params;
  const locationType = urlParams?.[0];
  const locationId = urlParams?.[1];

  let name = 'Worldwide';

  if (locationType && ALLOWED_LOCATION_TYPES.includes(locationType) && locationId) {
    const queryClient = new QueryClient();
    try {
      const { data } = await queryClient.fetchQuery(locationQueryOptions(locationType, locationId));
      if (data?.name) name = data.name;
    } catch {
      // Leave the default; the page itself decides whether this is a 404.
    }
  }

  return { title: `${name} (embedded)` };
}

export default async function EmbeddedPage({ params }: { params: Promise<{ params?: string[] }> }) {
  const { params: urlParams } = await params;
  const locationType = urlParams?.[0] ?? null;
  const locationId = urlParams?.[1] ?? null;

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
      <EmbeddedWrapper />
    </HydrationBoundary>
  );
}
