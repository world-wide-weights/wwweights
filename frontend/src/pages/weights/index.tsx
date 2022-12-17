import { GetServerSideProps, InferGetServerSidePropsType } from "next"
import Head from "next/head"
import { Headline } from "../../components/Headline/Headline"
import { ItemPreview } from "../../components/Item/ItemPreview"
import { Pagination } from "../../components/Pagination/Pagination"
import { routes } from "../../services/routes/routes"

const DEFAULT_ITEMS_PER_PAGE = 16
const ITEMS_PER_PAGE_MAXIMUM = 100
const FIRST_PAGE = 1

export type Item = {
    id: number, // TODO: Change
    name: string
    slug: string
    weight: {
        value: number
        aditionalValue?: number
        isCa: false
    },
    source?: string
    image?: string
    tags: {
        name: string
        slug: string
    }[]
}

type WeightsListProps = {
    items: Item[],
    currentPage: number,
    limit: number
}

/** Base List for weights */
export default function WeightsList({ items, currentPage, limit }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const siteTitle = `Latest ${currentPage > 1 ? `| Page ${currentPage} ` : ``}- World Wide Weights`

    return (<>
        {/* Meta Tags */}
        <Head>
            <title>{siteTitle}</title>
        </Head>

        <div className="container">
            {/* Headline */}
            <Headline level={3}>All weights</Headline>

            {/* Weights (todos) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-10">
                {items.map((item) => <ItemPreview datacy="weights-list-item" key={item.id} name={item.name} slug={item.slug} weight={`${item.weight.isCa ? "ca." : ""}${item.weight.value}${item.weight.aditionalValue ? `- ${item.weight.aditionalValue}` : ""} g`} imageUrl="https://picsum.photos/200" />)}
            </div>

            {/* Pagination */}
            <Pagination totalItems={100} currentPage={currentPage} itemsPerPage={limit} defaultItemsPerPage={DEFAULT_ITEMS_PER_PAGE} baseRoute={routes.weights.list} />
        </div>
    </>
    )
}

export const getServerSideProps: GetServerSideProps<WeightsListProps> = async (context) => {
    const currentPage = parseInt(context.query.page as string ?? FIRST_PAGE)
    const limit = parseInt(context.query.limit as string ?? DEFAULT_ITEMS_PER_PAGE)

    // Validate Query
    if (currentPage < 1 || limit < 1 || limit > ITEMS_PER_PAGE_MAXIMUM) {
        return {
            notFound: true // Renders 404 page
        }
    }

    const response = await fetch(`http://localhost:3004/api/query/v1/items/getList?page=${currentPage}&limit=${limit}`)
    const data = await response.json()
    return {
        props: {
            items: data,
            currentPage,
            limit
        }
    }
}
