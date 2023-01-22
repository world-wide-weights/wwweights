import { GetServerSideProps, InferGetServerSidePropsType } from "next"
import Head from "next/head"
import { useRef, useState } from "react"
import { Button } from "../../components/Button/Button"
import { IconButton } from "../../components/Button/IconButton"
import { SearchEmptyState } from "../../components/EmptyState/SearchEmptyState"
import { SearchHeader } from "../../components/Header/SearchHeader"
import { Headline } from "../../components/Headline/Headline"
import { Icon } from "../../components/Icon/Icon"
import { ItemPreviewGrid } from "../../components/Item/ItemPreviewGrid"
import { ItemPreviewList } from "../../components/Item/ItemPreviewList"
import { Pagination } from "../../components/Pagination/Pagination"
import { Sort, SortType } from "../../components/Sort/Sort"
import { StatsCard } from "../../components/Statistics/StatsCard"
import { useLocalStorage } from "../../hooks/useLocalStorage"
import { routes } from "../../services/routes/routes"
import { generateWeightString } from "../../services/utils/weight"
import { Tag } from "../tags"

const DEFAULT_ITEMS_PER_PAGE = 16
const ITEMS_PER_PAGE_MAXIMUM = 100
const FIRST_PAGE = 1
const KEY_VIEW_TYPE = "discover_view_type"

export type Item = {
    id: string,
    name: string
    slug: string
    weight: Weight,
    source?: string
    image?: string
    tags: Tag[]
}
export type Weight = {
    value: number
    additionalValue?: number
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
    // Strings
    const siteTitle = `Latest ${currentPage > 1 ? `| Page ${currentPage} ` : ""}- World Wide Weights`
    const headlineItems = query === "" ? "All items" : query

    // Refs
    const initialRender = useRef<boolean>(true)

    // Local state
    const [statisticsExpanded, setStatisticsExpanded] = useState<boolean>(false)
    const [viewType, setViewType, loading] = useLocalStorage(KEY_VIEW_TYPE, "grid", initialRender)

    return <>
        {/* Meta Tags */}
        <Head>
            <title>{siteTitle}</title>
        </Head>

        {/* TODO (Zoe-Bot): Find a better solution instead of give sort and query */}
        {/* Search with related tags */}
        <SearchHeader query={query} sort={sort} />

        {/* Content */}
        <main className="container mt-5">
            {items.length === 0 ?
                // Empty State
                <SearchEmptyState query={query} />
                : <>
                    <div className={`lg:flex ${statisticsExpanded ? "lg:flex-col-reverse" : ""}`}>
                        {/*** Weights List ***/}
                        <div className={`${statisticsExpanded ? "" : "lg:w-2/3 2xl:w-[70%] lg:mr-10"} mb-10 lg:mb-0`}>
                            {/* Header Weights List */}
                            <div className="md:flex justify-between items-end mb-4">
                                <div className="flex items-end mb-2 lg:mb-0">
                                    {/* Headline */}
                                    <Headline level={3} hasMargin={false} className="mr-4">{headlineItems}</Headline>
                                    <p>{totalItems}</p>
                                </div>

                                {/* Sort */}
                                <div className="flex items-center mb-2 lg:mb-0">
                                    <IconButton datacy="discover-grid-view-button" icon="grid_view" color={viewType === "grid" ? "blue" : "gray"} dimOpacityWhenDisabled={false} onClick={() => setViewType("grid")} className="mr-2" />
                                    <IconButton datacy="discover-grid-list-button" icon="list" color={viewType === "list" ? "blue" : "gray"} dimOpacityWhenDisabled={false} onClick={() => setViewType("list")} className="mr-4" />

                                    {/* Sort Dropdown */}
                                    <div className="flex-grow">
                                        <Sort sort={sort} query={query} />
                                    </div>
                                </div>
                            </div>

                            {loading ? <p>Loading...</p> : <>
                                {/* Weights Box View */}
                                {viewType === "grid" && <div className={`grid ${statisticsExpanded ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4" : "grid-cols-1 md:grid-cols-2 2xl:grid-cols-3"} gap-2 md:gap-5 mb-5 md:mb-8`}>
                                    {items.map((item) => <ItemPreviewGrid datacy="weights-grid-item" key={item.slug} name={item.name} slug={item.slug} weight={item.weight} imageUrl="https://picsum.photos/200" />)}
                                </div>}

                                {/* Weights List View */}
                                {viewType === "list" && <ul className={"grid md:gap-2 mb-5 md:mb-8"}>
                                    {items.map((item) => <ItemPreviewList datacy="weights-list-item" key={item.slug} name={item.name} slug={item.slug} weight={item.weight} heaviestWeight={statistics.heaviest.weight} imageUrl="https://picsum.photos/200" />)}
                                </ul>}
                            </>}

                            {/* Pagination */}
                            <Pagination totalItems={totalItems} currentPage={currentPage} itemsPerPage={limit} defaultItemsPerPage={DEFAULT_ITEMS_PER_PAGE} query={query} sort={sort} baseRoute={routes.weights.list} />
                        </div>

                        {/*** Statistics ***/}
                        <div className={`${statisticsExpanded ? "" : "lg:items-start lg:w-1/2 xl:w-1/3 2xl:w-[30%]"}`}>
                            {/* Header Statistics */}
                            <div className={`flex ${statisticsExpanded ? "justify-between" : "lg:justify-end "} lg:items-end lg:h-[46px] mb-2 lg:mb-4`}>
                                {/* Headline */}
                                <Headline level={3} hasMargin={false} className={`${statisticsExpanded ? "" : "lg:hidden"} `}>Statistics</Headline>

                                {/* Show Statistics Button */}
                                <Button onClick={() => setStatisticsExpanded(!statisticsExpanded)} className="hidden lg:flex" kind="tertiary">{statisticsExpanded ? "Show less" : "Show more"}</Button>
                            </div>

                            {/* Statistics Content */}
                            <div className={`${statisticsExpanded ? "lg:flex-col" : "lg:items-start"} lg:flex`}>
                                <div className="flex mb-5 lg:mb-10">
                                    <button onClick={() => setStatisticsExpanded(!statisticsExpanded)} className="hidden lg:block bg-white self-stretch rounded-lg px-1 mr-2">
                                        <Icon>chevron_left</Icon>
                                    </button>

                                    <div className={`${statisticsExpanded ? "flex flex-col lg:flex-row" : "grid"} flex-grow md:flex-auto gap-2 lg:gap-4`}>
                                        <StatsCard classNameWrapper={`${statisticsExpanded ? "flex-1" : ""}`} icon="weight" value={generateWeightString(statistics.heaviest.weight)} descriptionTop={statistics.heaviest.name} descriptionBottom="Heaviest" />
                                        <StatsCard classNameWrapper={`${statisticsExpanded ? "flex-1" : ""}`} icon="eco" value={generateWeightString(statistics.lightest.weight)} descriptionTop={statistics.lightest.name} descriptionBottom="Lightest" />
                                        <StatsCard classNameWrapper={`${statisticsExpanded ? "flex-1" : ""}`} icon="scale" value={`${statistics.averageWeight} g`} descriptionBottom="Average" />
                                    </div>
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
        // TODO (Zoe-Bot): Update api endpoint when correct api is used
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/items?_page=${currentPage}&_limit=${limit}&_sort=weight.value&_order=${sort}&q=${query}`),
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
