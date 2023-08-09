import Head from 'next/head';

import MetaTags from 'containers/meta-tags';
import TranslateScripts from 'containers/translate-scripts';

const Home: React.FC = () => (
  <div>
    <Head>
      <title>Privacy policy</title>
      <MetaTags title="Global Mangrove Watch | Privacy policy" description="Privacy policy" />
    </Head>

    <TranslateScripts />

    <h1>Privacy policy</h1>
  </div>
);

export default Home;
