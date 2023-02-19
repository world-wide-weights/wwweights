import { Head, Html, Main, NextScript } from "next/document"

/**
 * Next.js Document component, just for add html lang.
 */
export default function Document() {
	return (
		<Html lang="en">
			<Head />
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	)
}
