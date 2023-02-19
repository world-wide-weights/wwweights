/** Imports all material symbols globally which we use as our icon pack */
import "material-symbols/rounded.css"
import { NextPage } from "next"
import { AppProps } from "next/app"
import Script from "next/script"
import NextNProgress from "nextjs-progressbar"
import React from "react"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Auth } from "../components/Auth/Auth"
import { Layout as DefaultLayout } from "../components/Layout/Layout"
import "../styles/global.css"

// Hide ads and analytics in development
const SHOULD_DISPLAY_ADS = process.env.NODE_ENV !== "development"
const SHOULD_LOAD_GA = process.env.NODE_ENV !== "development"

/**
 * When using this page type have the option to add custom props.
 * Page.layout --> Adds custom layout for this page.
 * Page.auth = {
 *    routeType: protected --> To see this page you need to be logged in.
 *    routeType: guest --> To see this page you need to be a guest (not logged in).
 *    routeType: public --> This page is public and can be seen by everyone this is the default.
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

	return (
		<>
			{/** Handles all global loading of bundles and SSR */}
			<NextNProgress color="#0967D2" height={5} />

			{/** Google AdSense */}
			{SHOULD_DISPLAY_ADS && (
				<Script
					async
					strategy="afterInteractive"
					onError={(e) => {
						console.error("Script failed to load", e)
					}}
					src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7697189508841626"
				/>
			)}

			{/** Google Analytics */}
			{SHOULD_LOAD_GA && (
				<>
					<Script async strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-TPQQFLWM0Q" />
					<Script id="google-analytics" strategy="afterInteractive">
						{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
  
        gtag('config', 'G-TPQQFLWM0Q');
        `}
					</Script>
				</>
			)}

			<Auth routeType={Component?.auth?.routeType ?? "public"}>
				{" "}
				{/** Auth wrapper */}
				<div className="font-sans">
					{layout(<Component {...pageProps} />)} {/** Page content with default or custom layout. */}
				</div>
			</Auth>
			<ToastContainer position="bottom-right" bodyClassName="font-sans text-black font-medium" />
		</>
	)
}

export default App
