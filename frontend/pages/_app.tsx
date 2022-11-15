import 'material-symbols';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Layout } from '../components/Layout/Layout';
import '../styles/global.css';

const App = ({ Component, pageProps }: AppProps) => {
  return <>
    <Head>
      <link rel="stylesheet" href="https://use.typekit.net/opi3gwx.css" />
    </Head>
    <Layout>
      <Component {...pageProps} />
    </Layout>
  </>
}

export default App
