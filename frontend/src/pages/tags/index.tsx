import { GetServerSideProps, InferGetServerSidePropsType } from "next"
import Head from "next/head"
import { Chip } from "../../components/Chip/Chip"
import { Headline } from "../../components/Headline/Headline"
import { Pagination } from "../../components/Pagination/Pagination"
import { routes } from "../../services/routes/routes"

const DEFAULT_ITEMS_PER_PAGE = 64
const ITEMS_PER_PAGE_MAXIMUM = 100
const FIRST_PAGE = 1

export type Tag = {
    name: string
    slug: string
}

type TagsListProps = {
    tags: Tag[]
    currentPage: number
    totalItems: number
    limit: number
}

/** Base List for tags */
export default function TagsList({ tags, currentPage, totalItems, limit }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const siteTitle = `All Tags ${currentPage > 1 ? `| Page ${currentPage} ` : ""}- World Wide Weights`

    return (<>
        {/* Meta Tags */}
        <Head>
            <title>{siteTitle}</title>
        </Head>

        <main className="container mt-5">
            {/* Headline */}
            <Headline level={3}>All tags</Headline>

            {/* tags */}
            <div className="flex flex-wrap pb-3">
                {tags.map((tag) => <Chip key={tag.name} to={routes.tags.single(tag.slug)}>{tag.name}</Chip>)}
            </div>

            {/* Pagination */}
            <Pagination totalItems={totalItems} currentPage={currentPage} itemsPerPage={limit} defaultItemsPerPage={DEFAULT_ITEMS_PER_PAGE} baseRoute={routes.tags.list} />
        </main>
    </>
    )
}

export const getServerSideProps: GetServerSideProps<TagsListProps> = async (context) => {
    const currentPage = parseInt(context.query.page as string ?? FIRST_PAGE)
    const limit = parseInt(context.query.limit as string ?? DEFAULT_ITEMS_PER_PAGE)

    // Validate Query
    if (currentPage < 1 || limit < 1 || limit > ITEMS_PER_PAGE_MAXIMUM) {
        return {
            notFound: true // Renders 404 page
        }
    }

    // const data = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/query/v1/tags/list?page=${currentPage}&limit=${limit}`)
    // const totalItems = parseInt(response.headers.get("x-total-count") ?? "100")

    return {
        props: {
            tags: [],
            currentPage,
            totalItems: 100,
            limit
        }
    }
}
