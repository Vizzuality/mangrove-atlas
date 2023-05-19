import type { GetServerSideProps } from 'next';

import DesktopLayout from 'layouts/desktop';
import MobileLayout from 'layouts/mobile';

import { Media } from 'components/media-query';

const Home = () => {
  return (
    <>
      <Media lessThan="sm">
        <MobileLayout />
      </Media>
      <Media greaterThanOrEqual="sm">
        <DesktopLayout />
      </Media>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};

export default Home;
