import Head from "next/head"
import { generateKeywordString } from "../../services/seo/keywords"

type BaseSeoProps = {
    title: string
    shouldDisplayTitleSuffix?: boolean
    description: string
    keywords?: string[]
    canonicalLink?: string

    ogImage?: string
    ogImageWidth?: string
    ogImageHeight?: string
    ogImageDescription?: string

    twitterImage?: string
}

export const siteTitle = "World Wide Weights"
export const baseTitleSuffix = ` | ${siteTitle}`
export const baseKeywords = ["weights database", "World Wide Weights", "wwweights"]

export const Seo: React.FC<BaseSeoProps> = ({ title, shouldDisplayTitleSuffix = true, description, keywords = [], canonicalLink = "", ogImage, ogImageHeight, ogImageWidth, twitterImage, ogImageDescription }) => (<Head>
    {/** Define per page */}
    <title key="title">{title}{shouldDisplayTitleSuffix && baseTitleSuffix}</title>
    <meta name="description" content={description} key="metaDescription" />
    <meta name="keywords" content={generateKeywordString([...keywords, ...baseKeywords])} key="metaKeywords" />

    {/** Open Graph */}
    <meta property="og:url" content={`${process.env.NEXT_PUBLIC_CLIENT_BASE_URL}${canonicalLink}`} key="ogUrl" />
    <meta property="og:title" content={`${title}${shouldDisplayTitleSuffix && baseTitleSuffix}`} key="ogTitle" />
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
</Head>)
