import { notFound } from 'next/navigation';

import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';
import turfBbox from '@turf/bbox';
import type { Metadata } from 'next';

import type { DataResponse } from '@/containers/datasets/locations/hooks';
import MainApp from '@/containers/main-app';

const ALLOWED_LOCATION_TYPES = ['custom-area', 'country', 'wdpa'];

export const metadata: Metadata = {
  title: 'Global Mangrove Watch',
  description:
    'Global Mangrove Watch (GMW) is an online platform that provides the remote sensing data and tools for monitoring mangroves necessary for this. It gives universal access to near real-time information on where and what changes there are to mangroves across the world, and highlights why they are valuable.',
  openGraph: {
    title: 'Global Mangrove Watch',
    description:
      'Global Mangrove Watch (GMW) is an online platform that provides the remote sensing data and tools for monitoring mangroves necessary for this. It gives universal access to near real-time information on where and what changes there are to mangroves across the world, and highlights why they are valuable.',
    type: 'website',
  },
};

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
      await queryClient.prefetchQuery({
        queryKey: ['location', locationType, locationId],
        queryFn: async () => {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/locations/${locationId}`, {
            headers: { 'Content-Type': 'application/json' },
          });
          if (!res.ok) throw new Error(`Location fetch failed: ${res.status}`);
          const json = await res.json();
          return { data: json.data } as { data: DataResponse['data'][0] };
        },
      });

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
      <MainApp locationType={locationType ?? null} locationId={locationId ?? null} />
    </HydrationBoundary>
  );
}
