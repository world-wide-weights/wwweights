import { GetStaticPaths, GetStaticProps, InferGetServerSidePropsType } from "next"
import Head from "next/head"
import Image from "next/image"
import { Item } from "."
import { Chip } from "../../components/Chip/Chip"
import { SearchHeader } from "../../components/Header/SearchHeader"
import { Headline } from "../../components/Headline/Headline"
import { Icon } from "../../components/Icon/Icon"
import { StatsCompareCard } from "../../components/Statistics/StatsCompareCard"
import { routes } from "../../services/routes/routes"
import { generateWeightString } from "../../services/utils/weight"

type WeightsSingleProps = {
    item: Item
}

/** Single Page of a weight */
export default function WeightsSingle({ item }: InferGetServerSidePropsType<typeof getStaticProps>) {
    const siteTitle = `${item.name} Weight | WWWeights`
    const weightString = generateWeightString(item.weight)
    const sourceName = item.source ? new URL(item.source).hostname.replace("www.", "") : null

    return <>
        {/* Meta Tags */}
        <Head>
            <title>{siteTitle}</title>
        </Head>

        {/* Search with related tags */}
        <SearchHeader />

        <main className="container mt-10 md:mt-20">
            <div className="grid grid-cols-[120px_1fr] md:grid-cols-[250px_1fr] items-center lg:grid-cols-2 mb-10">
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

            <div className="lg:w-1/2">
                <StatsCompareCard type="cars" weight={32000000} itemName={item.name} />
                <StatsCompareCard type="earths" weight={320000} itemName={item.name} />
                <StatsCompareCard type="people" weight={32} itemName={item.name} />
                <StatsCompareCard type="titanics" weight={32} itemName={item.name} />
                <StatsCompareCard type="water_bottle" weight={900} itemName={item.name} />
            </div>
        </main>
    </>
}

export const getStaticProps: GetStaticProps<WeightsSingleProps> = async (context) => {
    const slug = context.params ? context.params.slug : "1"
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/query/v1/items/list?slug=${slug}`)
    const data = await response.json()

    // Validate Query
    if (!data.slug) {
        return {
            notFound: true // Renders 404 page
        }
    }

    return {
        props: {
            item: data
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