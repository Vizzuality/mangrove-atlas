import { printModeState } from 'store/print-mode';

import { QueryClient, dehydrate } from '@tanstack/react-query';
import turfBbox from '@turf/bbox';
import type { GetServerSideProps } from 'next';
import { useRecoilValue } from 'recoil';

import DesktopLayout from 'layouts/desktop';
import MobileLayout from 'layouts/mobile';

import { fetchLocations } from 'containers/datasets/locations/hooks';
import type { DataResponse } from 'containers/datasets/locations/hooks';

import { Media } from 'components/media-query';

import API from 'services/api';

const Home = () => {
  const isPrintingMode = useRecoilValue(printModeState);
  return (
    <>
      {!isPrintingMode && (
        <Media lessThan="md">
          <MobileLayout />
        </Media>
      )}
      <DesktopLayout />
    </>
  );
};

const ALLOWED_LOCATION_TYPES = ['custom-area'];

const queryClient = new QueryClient();

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const locationType = ctx.params?.params?.[0];
  const locationId = ctx.params?.params?.[1];
  const URLBounds = ctx.query?.bounds;

  if (locationId) {
    try {
      const response = await API.get<{ data: DataResponse['data'][0] }>(`/locations/${locationId}`);
      if (response.status === 200) {
        queryClient.setQueryData(['location', locationType, locationId], {
          data: response.data.data,
        });

        if (!URLBounds) {
          queryClient.setQueryData(['location-bounds'], turfBbox(response.data.data.bounds));
        }

        return {
          props: {
            dehydratedState: dehydrate(queryClient),
          },
        };
      } else {
        return {
          notFound: true,
        };
      }
    } catch (e) {
      return {
        notFound: true,
      };
    }
  }

  if (locationType && !ALLOWED_LOCATION_TYPES.includes(locationType)) {
    return {
      notFound: true,
    };
  }

  if (queryClient.getQueryState(['locations'])?.status !== 'success') {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    queryClient.prefetchQuery({
      queryKey: ['locations'],
      queryFn: fetchLocations,
    });
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default Home;
