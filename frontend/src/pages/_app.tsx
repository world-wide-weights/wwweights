/** Import font support */
import localFont from '@next/font/local';
/** Imports all material symbols globally which we use as our icon pack */
import 'material-symbols/rounded.css';
import { NextPage } from 'next';
import type { AppProps } from 'next/app';
import React from 'react';
import { Layout } from '../components/Layout/Layout';
import '../styles/global.css';

// Font
const metropolis = localFont({
  src: [
    {
      path: '../assets/font/metropolis/Metropolis-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../assets/font/metropolis/Metropolis-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../assets/font/metropolis/Metropolis-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: "--font-metropolis"
})

// Use this as type when have a page with custom layout
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: React.ReactElement) => React.ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

/**
 * Starting point of the app. 
 * Wrapps all pages.
 */
const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  // When getLayout function is defined use custom layout
  const getLayout = Component.getLayout ?? ((page: React.ReactElement) => {
    return <Layout>
      {page}
    </Layout>
  })

  return <div className={`${metropolis.variable} font-sans`}>
    {getLayout(<Component {...pageProps} />)}
  </div>
}

export default App
