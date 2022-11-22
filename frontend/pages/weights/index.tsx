import { GetServerSideProps, InferGetServerSidePropsType } from "next"
import Head from "next/head"
import { Headline } from "../../components/Headline/Headline"
import { ItemPreview } from "../../components/Item/ItemPreview"
import { Pagination } from "../../components/Pagination/Pagination"

const DEFAULT_ITEMS_PER_PAGE = 16
const ITEMS_PER_PAGE_MAXIMUM = 100
const FIRST_PAGE = 1

// As long as we do not have a weight. Let's work with Todo
type Todo = {
    userId: number
    id: number
    title: string
    completed: boolean
}

type WeightsListProps = {
    items: Todo[],
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
                {items.map((item) => <ItemPreview dataCy="weights-list-item" key={item.id} name={`${item.id}: ${item.title}`} weight={item.completed ? "✓" : "X"} imageUrl="https://via.placeholder.com/96.png" id={item.id.toString()} />)}
            </div>

            {/* Pagination */}
            <Pagination totalItems={100} currentPage={currentPage} itemsPerPage={limit} defaultItemsPerPage={DEFAULT_ITEMS_PER_PAGE} basePath={"/weights"} />
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

    const response = await fetch(`https://jsonplaceholder.typicode.com/todos?_start=${(currentPage - 1) * limit}&_limit=${limit}`)
    const data = await response.json()
    return {
        props: {
            items: data,
            currentPage,
            limit
        }
    }
}
