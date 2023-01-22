import { GetStaticPaths, GetStaticProps, InferGetServerSidePropsType } from "next"
import Head from "next/head"
import Image from "next/image"
import { useRouter } from "next/router"
import { Item } from "."
import { Chip } from "../../components/Chip/Chip"
import { CompareContainer } from "../../components/CompareContainer/CompareContainer"
import { SearchHeader } from "../../components/Header/SearchHeader"
import { Headline } from "../../components/Headline/Headline"
import { Icon } from "../../components/Icon/Icon"
import { ItemPreviewList } from "../../components/Item/ItemPreviewList"
import { Tab } from "../../components/Tabs/Tab"
import { Tabs } from "../../components/Tabs/Tabs"
import { routes } from "../../services/routes/routes"
import { calculateMedianWeight, generateWeightString } from "../../services/utils/weight"
import Custom404 from "../404"

type WeightsSingleProps = {
    item: Item
    relatedItems: Item[]
}

/** Single Page of a weight */
export default function WeightsSingle({ item, relatedItems }: InferGetServerSidePropsType<typeof getStaticProps>) {
    // Title
    const siteTitle = `${item.name} Weight | WWWeights`

    // Generate Compare Weight
    const compareWeight = calculateMedianWeight(item.weight)

    const relatedItemsWithItemSorted = [...relatedItems, item].sort((a, b) => a.weight.value - b.weight.value)

    // Handle tabs
    const currentTab = useRouter().query.tab
    const singleWeightTabs = [{
        title: "Overview",
        slug: "",
        content: <>
            <Headline level={4}>Related Items</Headline>
            <ul className="mb-5 md:mb-10">
                {relatedItemsWithItemSorted.map(relatedItem => <ItemPreviewList selectedItem={relatedItem.name === item.name} disableLink={relatedItem.name === item.name} key={relatedItem.id} name={relatedItem.name} slug={relatedItem.slug} weight={relatedItem.weight} heaviestWeight={relatedItemsWithItemSorted[relatedItemsWithItemSorted.length - 1].weight} imageUrl="https://picsum.photos/200" />)}
            </ul>

            <CompareContainer weight={compareWeight} itemName={item.name} />
        </>
    }, {
        title: "Compare",
        slug: "compare",
        content: <CompareContainer weight={compareWeight} itemName={item.name} />
    }]
    const currentTabIndex = singleWeightTabs.findIndex(singleWeightTab => singleWeightTab.slug === currentTab)

    // Strings Generator
    const weightString = generateWeightString(item.weight)
    const sourceName = item.source ? new URL(item.source).hostname.replace("www.", "") : null

    // Throw error when tab does not exist.
    if (currentTabIndex === -1 && currentTab)
        return <Custom404 />

    return <>
        {/* Meta Tags */}
        <Head>
            <title>{siteTitle}</title>
        </Head>

        {/* Search with related tags */}
        <SearchHeader hasHeadline={false} />

        <main className="container mt-4 md:mt-10">
            <div className="bg-white rounded-lg px-3 md:px-6 py-4 md:py-8">
                <div className="grid grid-cols-[120px_1fr] md:grid-cols-[250px_1fr] items-center lg:grid-cols-2 mb-5 md:mb-10">
                    {/* Headline and Weight */}
                    <div className="lg:col-start-1 lg:col-end-3 pl-5 lg:pl-0 md:mt-5">
                        <a target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-700 text-lg sm:text-2xl md:mb-2" href={`https://www.google.com/search?q=${item.name}`}>
                            {item.name}
                            <Icon className="ml-2">open_in_new</Icon>
                        </a>
                        <Headline size="text-2xl sm:text-4xl lg:text-5xl">{weightString}</Headline>
                    </div>

                    {/* Source and Tags */}
                    <div className="flex flex-col self-start col-start-1 col-end-3 lg:row-start-2 mt-5 lg:mt-0">
                        {item.source && <a target="_blank" rel="noopener noreferrer" href={item.source} className="text-gray-600 hover:text-gray-700 mb-3 md:mb-5">According to {sourceName} a {item.name} weights {weightString}.</a>}
                        <ul className="flex md:flex-wrap overflow-y-auto">
                            <li><div className="md:hidden absolute bg-gradient-to-r right-0 from-transparent to-gray-100 w-20 h-8 py-1"></div></li>
                            {item.tags.map((tag, index) => <li key={tag.name} className={`${index === item.tags.length - 1 ? "mr-20" : ""}`}><Chip to={routes.tags.single(tag.slug)}>{tag.name}</Chip></li>)}
                        </ul>
                    </div>

                    {/* Weights Image */}
                    <div className="row-start-1 lg:row-end-3 lg:flex lg:justify-end">
                        {/* No better way yet: https://github.com/vercel/next.js/discussions/21379 Let's take a look at this when we got problems with it */}
                        <Image src="https://picsum.photos/1200" priority className="sm:hidden rounded-xl" alt={item.name} width={120} height={120} />
                        <Image src="https://picsum.photos/1200" priority className="hidden sm:block rounded-xl" alt={item.name} width={230} height={230} />
                    </div>
                </div>
                <hr className="mb-4 md:mb-8" />

                {/* Tabs */}
                <div>
                    <Tabs selectedTabIndex={!currentTab ? 0 : currentTabIndex}>
                        {singleWeightTabs.map(singleWeightTab => <Tab key={singleWeightTab.slug} title={singleWeightTab.title} link={routes.weights.single(item.slug, { tab: singleWeightTab.slug })}>
                            <div className="bg-gray-100 rounded-lg py-4 px-3 md:px-4">
                                {singleWeightTab.content}
                            </div>
                        </Tab>)}
                    </Tabs>
                </div>
            </div>
        </main>
    </>
}

export const getStaticProps: GetStaticProps<WeightsSingleProps> = async (context) => {
    const slug = context.params ? context.params.slug : "1"

    // Fetch item and related items
    const [itemResponse, relatedItemsResponse] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/query/v1/items/list?slug=${slug}`),
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/related_items`),
    ])

    // Read jsons from item and related items
    const [item, relatedItems] = await Promise.all([
        itemResponse.json(),
        relatedItemsResponse.json()
    ])

    // Validate Query
    if (!item.slug) {
        return {
            notFound: true // Renders 404 page
        }
    }

    return {
        props: {
            item,
            relatedItems
        },
        revalidate: 10
    }
}

export const getStaticPaths: GetStaticPaths = () => {
    return {
        paths: [],
        fallback: "blocking"
    }
}