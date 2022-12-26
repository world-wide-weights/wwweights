import { Form, Formik } from "formik"
import { GetServerSideProps, InferGetServerSidePropsType } from "next"
import Head from "next/head"
import { useState } from "react"
import { Button } from "../../components/Button/Button"
import { SearchEmptyState } from "../../components/EmptyState/SearchEmptyState"
import { Dropdown } from "../../components/Form/Dropdown/Dropdown"
import { SearchHeader } from "../../components/Header/SearchHeader"
import { Headline } from "../../components/Headline/Headline"
import { Icon } from "../../components/Icon/Icon"
import { ItemPreviewBox } from "../../components/Item/ItemPreviewBox"
import { Pagination } from "../../components/Pagination/Pagination"
import { StatsCard } from "../../components/Statistics/StatsCard"
import { routes, SortType } from "../../services/routes/routes"
import { generateWeightString } from "../../services/utils/weight"

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

type Statistics = {
    heaviest: Item
    lightest: Item
    averageWeight: number // in gram
}

type WeightsListProps = {
    items: Item[]
    currentPage: number
    totalItems: number
    limit: number
    query: string
    sort: SortType
    statistics: Statistics
}

/** 
 * Discover Page, list all items, search results and single tags
 */
export default function WeightsList({ items, currentPage, totalItems, limit, query, sort, statistics }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    // Site Title
    const siteTitle = `Latest ${currentPage > 1 ? `| Page ${currentPage} ` : ``}- World Wide Weights`
    const headlineItems = query === "" ? "All items" : query

    // Local state
    const [statisticsExpanded, setStatisticsExpanded] = useState<boolean>(false)

    const initialValues = {
        sort: "asc"
    }

    const submitForm = (values: typeof initialValues) => {
        routes.weights.list()
    }

    const sortDropdownOptions = [
        {
            value: "asc",
            label: "Heaviest",
            icon: "face"
        }, {
            value: "desc",
            label: "Lightest",
            icon: "face"
        },
    ]

    return <>
        {/* Meta Tags */}
        <Head>
            <title>{siteTitle}</title>
        </Head>

        {/* Search with related tags */}
        <SearchHeader query={query} />

        {/* Content */}
        <main className="container mt-5">
            {items.length === 0 ?
                // Empty State
                <SearchEmptyState query={query} />
                : <>
                    {/* Not Expanded Headline bar */}
                    {!statisticsExpanded && <div className="flex items-center justify-between">
                        <div className="flex items-end mb-2 md:mb-4">
                            {/* Headline Weight  */}
                            <Headline level={3} hasMargin={false} className="mr-4">{headlineItems}</Headline>
                            <p>{totalItems}</p>
                        </div>

                        {/* Show more Statistics Button */}
                        <Button onClick={() => setStatisticsExpanded(true)} className="hidden md:flex" kind="tertiary">Show more</Button>
                    </div>}

                    <div className={`md:flex ${statisticsExpanded ? "md:flex-col-reverse" : ""}`}>

                        {/* Weights List */}
                        <div className={`${statisticsExpanded ? "" : "md:w-1/2 lg:w-2/3 2xl:w-[70%] md:mr-10"} mb-10 md:mb-0`}>
                            {/* Headline Weight Expanded */}
                            {statisticsExpanded && <div className="flex items-end mb-2 md:mb-4">
                                <Headline level={3} hasMargin={false} className="mr-4">{headlineItems}</Headline>
                                <p>{totalItems}</p>
                            </div>}

                            <Formik initialValues={initialValues} onSubmit={submitForm}>
                                <Form>
                                    <Dropdown name="sort" options={sortDropdownOptions} />
                                </Form>
                            </Formik>

                            {/* Weights */}
                            <div className={`grid ${statisticsExpanded ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4" : "grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3"} gap-5 mb-10`}>
                                {items.map((item) => <ItemPreviewBox datacy="weights-list-item" key={item.id} name={item.name} slug={item.slug} weight={item.weight} imageUrl="https://picsum.photos/200" />)}
                            </div>

                            {/* Pagination */}
                            <Pagination totalItems={totalItems} currentPage={currentPage} itemsPerPage={limit} defaultItemsPerPage={DEFAULT_ITEMS_PER_PAGE} query={query} sort={sort} baseRoute={routes.weights.list} />
                        </div>

                        {/* Statistics */}
                        <div className={`${statisticsExpanded ? "md:flex-col" : "md:items-start md:w-1/2 lg:w-1/3 2xl:w-[30%]"} md:flex`}>
                            <div className="flex justify-between">
                                {/* Headline Statistics */}
                                <Headline level={3} className={`${statisticsExpanded ? "" : "md:hidden"} `}>Statistics</Headline>

                                {/* Show less Statistics Button */}
                                {statisticsExpanded && <Button onClick={() => setStatisticsExpanded(false)} className="hidden md:flex" kind="tertiary">Show less</Button>}
                            </div>

                            {/* Statistics */}
                            <div className="flex mb-5 md:mb-10">
                                <button onClick={() => setStatisticsExpanded(!statisticsExpanded)} className="hidden md:block bg-white self-stretch rounded-lg px-1 mr-2">
                                    <Icon>chevron_left</Icon>
                                </button>

                                <div className={`${statisticsExpanded ? "flex flex-col md:flex-row" : "grid"} flex-grow md:flex-auto gap-2 md:gap-4`}>
                                    <StatsCard classNameWrapper={`${statisticsExpanded ? "flex-1" : ""}`} icon="weight" value={generateWeightString(statistics.heaviest.weight)} descriptionTop={statistics.heaviest.name} descriptionBottom="Heaviest" />
                                    <StatsCard classNameWrapper={`${statisticsExpanded ? "flex-1" : ""}`} icon="eco" value={generateWeightString(statistics.lightest.weight)} descriptionTop={statistics.lightest.name} descriptionBottom="Lightest" />
                                    <StatsCard classNameWrapper={`${statisticsExpanded ? "flex-1" : ""}`} icon="scale" value={`~${statistics.averageWeight} g`} descriptionBottom="Average" />
                                </div>
                            </div>
                        </div>
                    </div>
                </>}
        </main>
    </>
}

export const getServerSideProps: GetServerSideProps<WeightsListProps> = async (context) => {
    const currentPage = parseInt(context.query.page as string ?? FIRST_PAGE)
    const limit = parseInt(context.query.limit as string ?? DEFAULT_ITEMS_PER_PAGE)
    const query = context.query.query as string ?? ""
    const sort = context.query.sort as SortType ?? "asc"

    // Validate Query
    if (currentPage < 1 || limit < 1 || limit > ITEMS_PER_PAGE_MAXIMUM) {
        return {
            notFound: true // Renders 404 page
        }
    }

    // Fetch items and statistics
    const [itemsResponse, statisticResponse] = await Promise.all([
        // TODO (Zoe-Bot): Update api endpoint when correct api is used (sort)
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/query/v1/items/list?page=${currentPage}&limit=${limit}&sort=weight.value&order=${sort}&query=${query}`),
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/query/v1/items/statistics`),
    ])

    // Read jsons from items and statistics
    const [items, statistics] = await Promise.all([
        itemsResponse.json(),
        statisticResponse.json()
    ])

    const totalItems = parseInt(itemsResponse.headers.get("x-total-count") ?? "100") // Faalback For tests its 100 in future (when our api is used) this information will come from body and this will be removed anyway

    return {
        props: {
            items,
            currentPage,
            limit,
            totalItems,
            query,
            sort,
            statistics
        }
    }
}
