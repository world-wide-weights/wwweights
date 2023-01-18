/** Import font support */
import localFont from '@next/font/local';
/** Imports all material symbols globally which we use as our icon pack */
import 'material-symbols/rounded.css';
import { NextPage } from 'next';
import type { Session } from "next-auth";
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import React from 'react';
import { Auth } from '../components/Auth/Auth';
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

/**
 * When using this page type have the option to add custom props.
 * Page.getLayout --> Adds custom layout for this page.
 * Page.auth = {
 *    routeType: protected --> To see this page you need to be logged in
 *    routeType: guest --> To see this page you need to be a guest (not logged in)
 * } 
 */
export type NextPageCustomProps<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: React.ReactElement) => React.ReactNode
  auth?: {
    routeType: "protected" | "guest"
  }
}

type AppPropsCustom = AppProps<{ session: Session }> & {
  Component: NextPageCustomProps
}

/**
 * Starting point of the app. 
 * Wrapps all pages.
 */
const App = ({ Component, pageProps: { session, ...pageProps } }: AppPropsCustom) => {
  // When getLayout function is defined use custom layout
  const setLayout = Component.getLayout ?? ((page: React.ReactElement) => {
    return <Layout>
      {page}
    </Layout>
  })

  // When auth is defined wrap auth around page
  const auth = Component.auth ?
    <Auth routeType={Component.auth.routeType}>
      <Component {...pageProps} />
    </Auth> :
    <Component {...pageProps} />

  return <>
    <SessionProvider session={session}>
      <div className={`${metropolis.variable} font-sans`}>
        {setLayout(auth)}
      </div>
    </SessionProvider>
  </>
}

export default App
