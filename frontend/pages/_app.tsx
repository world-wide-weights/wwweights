import 'material-symbols';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Layout } from '../components/Layout/Layout';
import '../styles/global.css';

const App = ({ Component, pageProps }: AppProps) => {
  return <>
    <Head>
      <style>
        @import url('https://use.typekit.net/opi3gwx.css');
      </style>
    </Head>
    <Layout>
      <Component {...pageProps} />
    </Layout>
  </>
}

export default App
