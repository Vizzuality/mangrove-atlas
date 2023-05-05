import type { GetServerSideProps } from 'next';

import DesktopLayout from 'layouts/desktop';

const Home = () => <DesktopLayout />;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};

export default Home;
