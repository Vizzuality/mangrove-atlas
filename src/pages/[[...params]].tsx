import { printModeState } from '@/store/print-mode';

import { getServerSession } from 'next-auth/next';
import { authOptions } from './api/auth/[...nextauth]';

import { QueryClient, dehydrate } from '@tanstack/react-query';
import turfBbox from '@turf/bbox';
import type { GetServerSideProps } from 'next';
import { useRecoilValue } from 'recoil';
import { useWindowSize } from 'usehooks-ts';

import DesktopLayout from '@/layouts/desktop';
import MobileLayout from '@/layouts/mobile';

import type { DataResponse } from '@/containers/datasets/locations/hooks';
import MetaTags from '@/containers/meta-tags';

import { breakpoints } from '@/styles/styles.config';

import API from 'services/api';

const Home = () => {
  const isPrintingMode = useRecoilValue(printModeState);

  const { width: screenWidth } = useWindowSize();

  return (
    <>
      <MetaTags
        title="Global Mangrove Watch"
        description="Global Mangrove Watch (GMW) is an online platform that provides the remote sensing data and tools for monitoring mangroves necessary for this. It gives universal access to near real-time information on where and what changes there are to mangroves across the world, and highlights why they are valuable."
      />
      {screenWidth >= breakpoints.md && <DesktopLayout />}
    </>
  );
};

const ALLOWED_LOCATION_TYPES = ['custom-area'];

const queryClient = new QueryClient();

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  const locationType = ctx.params?.params?.[0];
  const locationId = ctx.params?.params?.[1];
  const URLBounds = ctx.query?.bounds;

  const normalizedSession = session
    ? {
        ...session,
        user: session.user
          ? {
              ...session.user,
              name: session.user.name ?? null,
              email: session.user.email ?? null,
              image: (session.user as any).image ?? null,
            }
          : null,
      }
    : null;

  const safeSession = normalizedSession ? JSON.parse(JSON.stringify(normalizedSession)) : null;

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
            session: safeSession || null,
          },
        };
      } else {
        return {
          notFound: true,
        };
      }
    } catch (e) {
      console.error(e);
      return {
        notFound: true,
      };
    }
  }

  if (locationType && !ALLOWED_LOCATION_TYPES?.includes(locationType)) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      session: safeSession || null,
    },
  };
};

export default Home;
