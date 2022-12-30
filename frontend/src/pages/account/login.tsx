import Head from "next/head";
import { NextPageWithLayout } from "../_app";

/**
 * Login page is a guest route.
 */
const Login: NextPageWithLayout = () => {
    return (
        <div>
            <Head>
                <title>WWWeights | Login</title>
                <meta charSet="utf-8" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>

            <main className="container">
                <p>Login</p>
            </main>
        </div>
    )
}

Login.getLayout = (page: React.ReactElement) => {
    return <>{page}</>
}

export default Login

