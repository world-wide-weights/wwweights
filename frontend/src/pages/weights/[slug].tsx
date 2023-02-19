import { GetStaticPaths, GetStaticProps, InferGetServerSidePropsType } from "next"
import Image from "next/image"
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../components/Auth/Auth"
import { Button } from "../../components/Button/Button"
import { Chip } from "../../components/Chip/Chip"
import { CompareContainer } from "../../components/CompareContainer/CompareContainer"
import { SearchHeader } from "../../components/Header/SearchHeader"
import { Headline } from "../../components/Headline/Headline"
import { Icon } from "../../components/Icon/Icon"
import { ItemSource } from "../../components/Item/ItemSource"
import { RelatedItems } from "../../components/RelatedItems/RelatedItems"
import { Seo } from "../../components/Seo/Seo"
import { Tab } from "../../components/Tabs/Tab"
import { Tabs } from "../../components/Tabs/Tabs"
import { queryServerRequest } from "../../services/axios/axios"
import { routes } from "../../services/routes/routes"
import { renderUnitIntoString } from "../../services/unit/unitRenderer"
import { getImageUrl } from "../../services/utils/getImageUrl"
import { calculateMedianWeight, generateWeightString } from "../../services/utils/weight"
import { Item } from "../../types/item"
import { PaginatedResponse } from "../../types/pagination"
import Custom404 from "../404"

type WeightsSingleProps = {
    item: Item
    relatedItems: Item[]
}

/** 
 * Single Page of a weight 
 */
export default function WeightsSingle({ item, relatedItems }: InferGetServerSidePropsType<typeof getStaticProps>) {
    // Generate Compare Weight
    const compareWeight = calculateMedianWeight(item.weight)

    const { getSession } = useContext(AuthContext)
    const [isAllowedToEdit, setIsAllowedToEdit] = useState(false)

    useEffect(() => {
        const addEditButton = async () => {
            const session = await getSession()
            if (!session) return

            setIsAllowedToEdit(item.userId === session.decodedAccessToken.id)
        }
        addEditButton()
    }, [getSession, item.userId])

    // Handle tabs
    const currentTab = useRouter().query.tab
    const singleWeightTabs = [{
        title: "Overview",
        slug: "",
        content: <>
            {relatedItems.length !== 0 && <RelatedItems item={item} relatedItems={relatedItems} />}
            <CompareContainer weight={compareWeight} itemName={item.name} />
        </>
    }, {
        title: "Compare",
        slug: "compare",
        content: <CompareContainer weight={compareWeight} itemName={item.name} />
    }]
    const currentTabIndex = singleWeightTabs.findIndex(singleWeightTab => singleWeightTab.slug === currentTab)

    // Strings + Unit Generator
    const weightString = renderUnitIntoString(item.weight)

    // Convert image url 
    const imageUrl = getImageUrl(item.image)

    // Throw error when tab does not exist.
    if (currentTabIndex === -1 && currentTab)
        return <Custom404 />

    return <>
        {/* Meta Tags */}
        <Seo
            title={`${item.name} Weight`}
            description={`The weight of ${item.name} is ${weightString}. ${item.tags.length ? `Discover more weights with topics like ${item.tags.map(tag => tag.name).join(", ")}` : "Discover more weights in the world largest database about weights!"}.`}
            ogImage={item.image}
            ogImageHeight={"512px"}
            ogImageWidth={"512px"}
            ogImageDescription={`${item.name}`}
            twitterImage={item.image}
        />

        {/* Search with related tags */}
        <SearchHeader hasHeadline={false} />

        <main className="container mt-4 md:mt-10">
            <div className="bg-white rounded-lg px-3 md:px-6 py-4 md:py-8">
                <div className="grid grid-cols-[120px_1fr] md:grid-cols-[250px_1fr] items-center lg:grid-cols-2 mb-5 md:mb-10">
                    {/* Headline and Weight */}
                    <div className="flex flex-col lg:col-start-1 lg:col-end-3 pl-5 lg:pl-0 md:mt-5">
                        <a target="_blank" rel="noopener noreferrer" title={item.name} className="flex items-center text-gray-700 w-40 sm:w-80 lg:w-[35rem] 2xl:w-[50rem] truncate text-lg sm:text-2xl md:mb-2" href={`https://www.google.com/search?q=${item.name}`}>
                            {item.name}
                            <Icon className="ml-2">open_in_new</Icon>
                        </a>
                        <Headline title={generateWeightString(item.weight)} size="text-2xl sm:text-4xl lg:text-5xl w-40 sm:w-80 lg:w-[35rem] 2xl:w-[50rem] truncate">{weightString}</Headline>
                    </div>

                    {/* Source and Tags */}
                    <div className="flex flex-col self-start col-start-1 col-end-3 lg:row-start-2 mt-5 lg:mt-0">
                        {item.source && <ItemSource name={item.name} source={item.source} weightString={weightString} />}
                        <ul className="flex md:flex-wrap overflow-y-auto">
                            <li><div className="md:hidden absolute bg-gradient-to-r right-0 from-transparent to-gray-100 w-20 h-8 py-1"></div></li>
                            {item.tags.map((tag, index) => <li key={tag.name} className={`${index === item.tags.length - 1 ? "mr-20" : ""}`}><Chip to={routes.tags.single(tag.name)}>{tag.name}</Chip></li>)}
                        </ul>
                    </div>

                    {/* Weights Image */}
                    {imageUrl && <div className="row-start-1 lg:row-end-3 lg:flex lg:justify-end">
                        <Image src={imageUrl} priority className="rounded-xl w-auto h-auto" alt={item.name} width={230} height={230} />
                    </div>}
                </div>
                <div className="flex justify-end">
                    {isAllowedToEdit && <Button kind="secondary" to={routes.contribute.edit(item.slug)} className="mb-4">Suggest an edit</Button>}
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
        queryServerRequest.get<PaginatedResponse<Item>>(`/items/list?slug=${slug}`),
        queryServerRequest.get<PaginatedResponse<Item>>(`/items/related?slug=${slug}`),
    ])

    // Items and RelatedItems
    const item = itemResponse.data.data[0]
    const relatedItems = relatedItemsResponse.data.data

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
