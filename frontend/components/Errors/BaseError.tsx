import Head from "next/head"
import { Button } from "../Button/Button"
import { Headline } from "../Headline/Headline"

type BaseErrorProps = {
    /** The title of the page */
    headline: string
    /** Custom descripton for example can be just a little text for more information or a list with the reasons. */
    description: React.ReactNode
    /** Custom url for back button */
    to?: string
    /** Custom text for back button */
    buttonText?: string
}

/**
 * Base Error Component, is used as a wrapper for errors like 404, 500,...
 */
export const BaseError: React.FC<BaseErrorProps> = ({ headline, description, to = "/", buttonText = "Back home" }) => {
    const siteTitle = `${headline} | World Wide Weights`

    return <>
        <Head>
            <title>{siteTitle}</title>
        </Head>
        <div className="container flex items-center min-h-[calc(100vh-76px-104px)]"> { /* 100% page - 76px Navbar - 104px Footer*/}
            <div className="md:w-2/3">
                <Headline>{headline}</Headline>
                {description}
                <Button className="mt-5" to={to} icon="arrow_back">{buttonText}</Button>
            </div>
        </div>
    </>
}