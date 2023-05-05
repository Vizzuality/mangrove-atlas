import type { GetServerSideProps } from 'next';

import DesktopLayout from 'layouts/desktop';

const LocationPage = () => <DesktopLayout />;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};

export default LocationPage;
