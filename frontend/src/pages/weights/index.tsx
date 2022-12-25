import { GetServerSideProps, InferGetServerSidePropsType } from "next"
import Head from "next/head"
import { SearchHeader } from "../../components/Header/SearchHeader"
import { Headline } from "../../components/Headline/Headline"
import { ItemPreviewBox } from "../../components/Item/ItemPreviewBox"
import { Pagination } from "../../components/Pagination/Pagination"
import { routes } from "../../services/routes/routes"

const DEFAULT_ITEMS_PER_PAGE = 16
const ITEMS_PER_PAGE_MAXIMUM = 100
const FIRST_PAGE = 1

export type Item = {
    id: number, // TODO: Change to string
    name: string
    slug: string
    weight: Weight,
    source?: string
    image?: string
    tags: {
        name: string
        slug: string
    }[]
}
export type Weight = {
    value: number
    aditionalValue?: number
    isCa: boolean
}

type WeightsListProps = {
    items: Item[]
    currentPage: number
    totalItems: number
    limit: number
    query: string
}

/** Base List for weights */
export default function WeightsList({ items, currentPage, totalItems, limit, query }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const siteTitle = `Latest ${currentPage > 1 ? `| Page ${currentPage} ` : ``}- World Wide Weights`

    return (<>
        {/* Meta Tags */}
        <Head>
            <title>{siteTitle}</title>
        </Head>

        <SearchHeader query={query} />

        <div className="container mt-5">
            {/* Headline */}
            <Headline level={3}>All weights</Headline>

            {/* Weights (todos) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-10">
                {items.map((item) => <ItemPreviewBox datacy="weights-list-item" key={item.id} name={item.name} slug={item.slug} weight={item.weight} imageUrl="https://picsum.photos/200" />)}
            </div>

            {/* Pagination */}
            <Pagination totalItems={totalItems} currentPage={currentPage} itemsPerPage={limit} defaultItemsPerPage={DEFAULT_ITEMS_PER_PAGE} query={query} baseRoute={routes.weights.list} />
        </div>
    </>
    )
}

export const getServerSideProps: GetServerSideProps<WeightsListProps> = async (context) => {
    const currentPage = parseInt(context.query.page as string ?? FIRST_PAGE)
    const limit = parseInt(context.query.limit as string ?? DEFAULT_ITEMS_PER_PAGE)
    const query = context.query.query as string ?? ""

    // Validate Query
    if (currentPage < 1 || limit < 1 || limit > ITEMS_PER_PAGE_MAXIMUM) {
        return {
            notFound: true // Renders 404 page
        }
    }

    const response = await fetch(`http://localhost:3004/api/query/v1/items/list?page=${currentPage}&limit=${limit}&query=${query}`)
    const data = await response.json()
    const totalItems = parseInt(response.headers.get("x-total-count") ?? "100") // Faalback For tests its 100 in future (when our api is used) this information will come from body and this will be removed anyway 

    return {
        props: {
            items: data,
            currentPage,
            limit,
            totalItems,
            query
        }
    }
}
