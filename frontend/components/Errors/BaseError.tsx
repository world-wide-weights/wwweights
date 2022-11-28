import Head from "next/head"
import { Button } from "../Button/Button"
import { Headline } from "../Headline/Headline"

type BaseErrorProps = {
    /** The headline of the page will also be document title of page */
    headline: string
    /** Custom descripton for example can be just a little text for more information or a list with the reasons. */
    children: React.ReactNode
    /** Custom url for back button */
    backButtonTo?: string
    /** Custom text for back button */
    backButtonText?: string
    /** For additional JSX for example try again button */
    ctaContent?: React.ReactNode
}

/**
 * Base Error Component, is used as a wrapper for errors like 404, 500,...
 */
export const BaseError: React.FC<BaseErrorProps> = ({ headline, children, backButtonTo = "/", backButtonText = "Back home", ctaContent }) => {
    const siteTitle = `${headline} | World Wide Weights`

    return <>
        <Head>
            <title>{siteTitle}</title>
        </Head>
        <div className="container flex items-center min-h-[calc(100vh-88.5px-102.5px)]"> { /* 100vh page - 88.5px Navbar - 102.5px Footer*/}
            <div className="md:w-2/3">
                <Headline>{headline}</Headline>
                {children}
                <div className="flex items-center mt-5">
                    <Button to={backButtonTo} icon="arrow_back">{backButtonText}</Button>
                    {ctaContent}
                </div>
            </div>
        </div>
    </>
}