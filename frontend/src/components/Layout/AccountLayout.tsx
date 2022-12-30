import Head from 'next/head';
import Image from 'next/image';
import logo from '../../../public/logo.png';
import { routes } from "../../services/routes/routes";
import { Button } from "../Button/Button";
import { Headline } from "../Headline/Headline";

type AccountLayoutProps = {
    /** Page content. Is parameter in getLayout. */
    page: React.ReactElement
    /** Title in head. */
    siteTitle: string
    /** Headline text. */
    headline: string
    /** Short description shown below headline. */
    description: string
}

/**
 * Layout Wrapper for Register and Login Pages (Account).
 * Adds image right, centers the content horizontal, adds header information and add footer at bottom of the page.
 */
export const AccountLayout: React.FC<AccountLayoutProps> = ({ page, headline, description, siteTitle }) => {
    return <>
        <Head>
            <title>WWWeights | {siteTitle}</title>
            <meta charSet="utf-8" />
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>

        <div className="lg:flex h-screen">
            {/* Left Side Content: Form */}
            <div className="flex flex-col lg:grid lg:grid-rows-5 lg:w-1/2 h-screen">

                {/* Content */}
                <main className="container row-start-2 mt-10 lg:mt-0">

                    {/* Header */}
                    <Image src={logo} alt="Logo" className="min-w-[40px] w-[40px] mb-12 lg:mb-16" />
                    <Headline>{headline}</Headline>
                    <p className="mb-4 lg:mb-5">{description}</p>
                    {page}
                </main>

                {/* Footer */}
                <footer className="container row-start-5 mt-auto">
                    <ul className="flex gap-3 py-4">
                        <li><Button to={routes.legal.terms} kind="tertiary">Terms of Service</Button></li>
                        <li><Button to={routes.legal.privacy} kind="tertiary">Privacy Policy</Button></li>
                    </ul>
                </footer>
            </div>

            {/* Right Side Content: Image */}
            <div className={`hidden lg:flex items-center justify-center bg-background-half-page bg-no-repeat bg-cover bg-center w-1/2`}>
                <div className="text-white font-bold w-1/2">
                    <h5 className="text-5xl leading-snug mb-5"><span className="text-blue-300">Weight</span> something and wanna share with people?</h5>
                    <h6 className="text-2xl">Login to share your stuff</h6>
                </div>
            </div>
        </div>
    </>
}
