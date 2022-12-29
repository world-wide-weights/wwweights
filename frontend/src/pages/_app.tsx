/** Import font support */
import localFont from '@next/font/local';
/** Imports all material symbols globally which we use as our icon pack */
import 'material-symbols/rounded.css';
import type { AppProps } from 'next/app';
import { Layout } from '../components/Layout/Layout';
import '../styles/global.css';

const metropolis = localFont({
  src: [
    {
      path: '../font/metropolis/Metropolis-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../font/metropolis/Metropolis-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../font/metropolis/Metropolis-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: "--font-metropolis"
})

const App = ({ Component, pageProps }: AppProps) => {
  return <main className={`${metropolis.variable} font-sans`}>
    <Layout>
      <Component {...pageProps} />
    </Layout>
  </main>
}

export default App
