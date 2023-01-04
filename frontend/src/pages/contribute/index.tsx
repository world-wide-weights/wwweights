import Head from "next/head";
import { Headline } from "../../components/Headline/Headline";
import { NextPageCustomProps } from "../_app";

/**
 * Login page is a guest route.
 */
const Contribute: NextPageCustomProps = () => {

    return <>
        {/* Meta Tags */}
        <Head>
            <title>Contribute | WWWeights</title>
            <meta charSet="utf-8" />
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>

        <main className="container">
            <Headline>Contribute</Headline>
        </main>
    </>
}

// Sets guest route (user need to be logged out)
Contribute.auth = {
    routeType: "protected"
}

export default Contribute

