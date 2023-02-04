import Head from "next/head"
import { RouterBreadcrumb } from "../Breadcrumb/RouterBreadcrumb"
import { Headline } from "../Headline/Headline"
import { Layout } from "./Layout"

type PageLayoutProps = {
    /** The main content. */
    children: React.ReactNode
    title: string
}

export const PageLayout: React.FC<PageLayoutProps> = ({ children, title }) => {
    const siteTitle = `${title} - World Wide Weights`

    return <Layout>
        <Head>
            <title>{siteTitle}</title>
        </Head>

        <main className="container mt-2 md:mt-5">
            <RouterBreadcrumb />
            <Headline>{title}</Headline>
            {children}
        </main>
    </Layout>
}