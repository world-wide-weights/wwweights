import Head from "next/head"
import { generateKeywordString } from "../../services/seo/keywords"

type BaseSeoProps = {
    /** The page title */
    title: string,
    /** Flag to determine if the title suffix should be displayed */
    shouldDisplayTitleSuffix?: boolean,
    /** The page description */
    description: string,
    /** The page keywords */
    keywords?: string[],
    /** The canonical link for the page */
    canonicalLink?: string,

    /** The image for Open Graph */
    ogImage?: string,
    /** The width of the Open Graph image */
    ogImageWidth?: string,
    /** The height of the Open Graph image */
    ogImageHeight?: string,
    /** The description of the Open Graph image */
    ogImageDescription?: string,

    /** The image for Twitter */
    twitterImage?: string
}


export const siteTitle = "World Wide Weights"
export const baseTitleSuffix = ` | ${siteTitle}`
export const baseKeywords = ["weights database", "World Wide Weights", "wwweights"]

/**
 * Sets metadata into the `<head>` for search engines and social media.
 * @param {BaseSeoProps} Properties for the Seo component
 * @returns Seo component
 */
export const Seo: React.FC<BaseSeoProps> = ({
    title,
    shouldDisplayTitleSuffix = true,
    description, keywords = [],
    canonicalLink = "",
    ogImage = `${process.env.NEXT_PUBLIC_CLIENT_BASE_URL}/img/og_default.jpg`,
    ogImageHeight = "630px",
    ogImageWidth = "1200px",
    ogImageDescription = `Preview Image of page "${title}"`,
    twitterImage = `${process.env.NEXT_PUBLIC_CLIENT_BASE_URL}/img/twitter_default.jpg`
}) => {
    const finalTitle = `${title}${shouldDisplayTitleSuffix && baseTitleSuffix}`
    return <Head>
        {/** Define per page */}
        <title key="title">{finalTitle}</title>
        <meta name="description" content={description} key="metaDescription" />
        <meta name="keywords" content={generateKeywordString([...keywords, ...baseKeywords])} key="metaKeywords" />

        {/** Open Graph */}
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_CLIENT_BASE_URL}${canonicalLink}`} key="ogUrl" />
        <meta property="og:title" content={finalTitle} key="ogTitle" />
        <meta property="og:site_name " content={siteTitle} key="ogStiteName" />
        <meta property="og:description" content={description} key="ogDescription" />

        {ogImage && <>
            <meta property="og:image" content={ogImage} key="ogImage" />
            <meta property="og:image:type" content="image/jpeg" key="ogImageType" />
            <meta property="og:image:width" content={ogImageWidth} key="ogImageWidth" /> {/** min. Recommend 1200x630 */}
            <meta property="og:image:height" content={ogImageHeight} key="ogImageHeight" />
            <meta property="og:image:alt" content={ogImageDescription} key="ogImageAlt" />
        </>}

        {/** Twitter */}
        <meta name="twitter:card" content="summary_large_image" key="twitterCard" />
        <meta name="twitter:site" content="@wwweights" key="twitterSite" />
        <meta name="twitter:creator" content="@wwweights" key="twitterCreator" />
        {twitterImage && <meta name="twitter:image" content={twitterImage} key="twitterImage" />}
    </Head>
}