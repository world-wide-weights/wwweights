/** Import font support */
import localFont from '@next/font/local';
/** Imports all material symbols globally which we use as our icon pack */
import 'material-symbols/rounded.css';
import type { AppProps } from 'next/app';
import { Layout } from '../components/Layout/Layout';
import '../styles/global.css';

const metropolis = localFont({
  src: [{
    path: '../font/Metropolis-Regular.woff2',
    weight: '400',
    style: 'normal',
  },
  {
    path: '../font/Metropolis-SemiBold.woff2',
    weight: '600',
    style: 'normal',
  }]
})

const App = ({ Component, pageProps }: AppProps) => {
  return <main className={`${metropolis.className} font-sans`}>
    <Layout>
      <Component {...pageProps} />
    </Layout>
  </main>
}

export default App