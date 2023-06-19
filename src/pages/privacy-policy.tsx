import Head from 'next/head';

import TranslateScripts from 'containers/translate-scripts';

const Home: React.FC = () => (
  <div>
    <Head>
      <title>Privacy policy</title>
      <meta name="viewport" content="width=device-width,initial-scale=1" />
    </Head>
    <TranslateScripts />
    <h1>Privacy policy</h1>
  </div>
);

export default Home;
