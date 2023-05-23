import { QueryClient, dehydrate } from '@tanstack/react-query';
import turfBbox from '@turf/bbox';
import type { GetServerSideProps } from 'next';

import DesktopLayout from 'layouts/desktop';

import { fetchLocations } from 'containers/datasets/locations/hooks';
import type { DataResponse } from 'containers/datasets/locations/hooks';

const Home = () => <DesktopLayout />;

const ALLOWED_LOCATION_TYPES = ['custom-area', 'wdpa', 'country', 'worldwide'];

const queryClient = new QueryClient();

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const locationType = ctx.params?.params?.[0];
  const locationId = ctx.params?.params?.[1];
  const queryState = queryClient.getQueryState(['locations']);
  const URLBounds = ctx.query?.bounds;

  if (queryState?.status !== 'success') {
    await queryClient.prefetchQuery({
      queryKey: ['locations'],
      queryFn: fetchLocations,
    });
  }

  const locations = queryClient.getQueryData<DataResponse>(['locations']);

  const ALLOWED_LOCATIONS = [
    ...new Set(
      locations.data
        .map(({ location_id, iso }) => [location_id, iso])
        .map((ids) => [...ids])
        .flat(1)
    ),
  ];

  if (
    (locationType && !ALLOWED_LOCATION_TYPES.includes(locationType)) ||
    (locationId && !ALLOWED_LOCATIONS.includes(locationId))
  ) {
    return {
      notFound: true,
    };
  }

  if (!URLBounds && locationId) {
    const location = locations.data.find(({ location_id, iso }) =>
      [location_id, iso].includes(locationId)
    );
    if (location) {
      queryClient.setQueryData(['location-bounds'], turfBbox(location.bounds));
    }
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default Home;
