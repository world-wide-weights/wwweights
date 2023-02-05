import { RouterBreadcrumb } from "../Breadcrumb/RouterBreadcrumb"
import { Headline } from "../Headline/Headline"
import { Seo } from "../Seo/Seo"
import { Layout } from "./Layout"

type PageLayoutProps = {
    /** The main content. */
    children: React.ReactNode
    title: string
}

export const PageLayout: React.FC<PageLayoutProps> = ({ children, title }) => {

    return <Layout>
        {/* Meta Tags */}
        <Seo
            title={title}
        />

        <main className="container mt-2 md:mt-5">
            <RouterBreadcrumb />
            <Headline>{title}</Headline>
            {children}
        </main>
    </Layout>
}