/** Import font support */
// import localFont from "@next/font/local"
/** Imports all material symbols globally which we use as our icon pack */
import "material-symbols/rounded.css"
import { NextPage } from "next"
import { AppProps } from "next/app"
import Script from "next/script"
import React from "react"
import { Auth } from "../components/Auth/Auth"
import { Layout as DefaultLayout } from "../components/Layout/Layout"
import "../styles/global.css"

// Hide ads and analytics in development
const SHOULD_DISPLAY_ADS = process.env.NODE_ENV !== "development"
const SHOULD_LOAD_GA = process.env.NODE_ENV !== "development"

// Font
// const metropolis = localFont({
//   src: [
//     {
//       path: "../assets/font/metropolis/Metropolis-Regular.woff2",
//       weight: "400",
//       style: "normal",
//     },
//     {
//       path: "../assets/font/metropolis/Metropolis-Medium.woff2",
//       weight: "500",
//       style: "normal",
//     },
//     {
//       path: "../assets/font/metropolis/Metropolis-Bold.woff2",
//       weight: "700",
//       style: "normal",
//     },
//   ],
//   variable: "--font-metropolis"
// })

/**
 * When using this page type have the option to add custom props.
 * Page.layout --> Adds custom layout for this page.
 * Page.auth = {
 *    routeType: protected --> To see this page you need to be logged in
 *    routeType: guest --> To see this page you need to be a guest (not logged in)
 *    routeType: public --> This page is public and can be seen by everyone
 * } 
 */
export type NextPageCustomProps<P = {}, IP = P> = NextPage<P, IP> & {
  layout?: (page: React.ReactElement) => React.ReactNode
  auth?: {
    routeType: "protected" | "guest" | "public"
  }
}

type AppPropsCustom = AppProps & {
  Component: NextPageCustomProps
}

/**
 * Starting point of the app. 
 * Wrapps all pages.
 */
const App = ({ Component, pageProps }: AppPropsCustom) => {
  // When layout function is defined use custom layout
  const layout = Component.layout ?? ((page: React.ReactElement) => <DefaultLayout>{page}</DefaultLayout>)

  return <>
    {/** Google AdSense */}
    {SHOULD_DISPLAY_ADS && <Script
      async
      strategy="afterInteractive"
      onError={(e) => { console.error("Script failed to load", e) }}
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7697189508841626"
    />}

    {/** Google Analytics */}
    {SHOULD_LOAD_GA && <>
      <Script async strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-TPQQFLWM0Q" />
      <Script id="google-analytics" strategy="afterInteractive" >
        {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
  
        gtag('config', 'G-TPQQFLWM0Q');
        `}
      </Script>
    </>}

    <Auth routeType={Component?.auth?.routeType ?? "public"}> {/** Auth wrapper */}
      <div className={"font-sans"}> * Global font
        {layout(<Component {...pageProps} />)} {/** Page content with default or custom layout. */}
      </div>
    </Auth>
  </>
}

export default App
