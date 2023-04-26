import Head from 'next/head';

import TranslateScripts from 'containers/translate-scripts';

const Home: React.FC = () => (
  <div>
    <Head>
      <title>Privacy policy</title>
    </Head>
    <TranslateScripts />
    <h1>Privacy policy</h1>
  </div>
);

export default Home;
