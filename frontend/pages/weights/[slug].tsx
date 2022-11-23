import { GetStaticPaths, GetStaticProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Image from "next/image";
import { Item } from ".";
import { Headline } from "../../components/Headline/Headline";
import { Tag } from "../../components/Tag/Tag";

// TODO (Zoe-Bot): Adjust types when list page merged and when using weights of course xD
type Todo = {
    userId: number
    id: number
    title: string
    completed: boolean
}

// TODO (Zoe-Bot): Adjust types when list page merged
type WeightsSingleProps = {
    item: Item
}

/** Single Page of a weight */
export default function WeightsSingle({ item }: InferGetServerSidePropsType<typeof getStaticProps>) {
    const siteTitle = `${item.name} Weight | WWWeights`

    return <>
        {/* Meta Tags */}
        <Head>
            <title>{siteTitle}</title>
        </Head>

        <div className="container mt-10 md:mt-20">
            <div className="grid grid-cols-[120px_1fr] md:grid-cols-[250px_1fr] items-center lg:grid-cols-2">
                {/* Headline and Weight */}
                <div className="lg:col-start-1 lg:col-end-3 pl-5 lg:pl-0 md:mt-5">
                    <Headline level={3}>{item.name}</Headline>
                    <h6 className="text-2xl sm:text-4xl lg:text-5xl font-bold md:mb-5">{`${item.weight.isCa ? "ca." : ""}${item.weight.value}${item.weight.aditionalValue ? `- ${item.weight.aditionalValue}` : ""} g`}</h6>
                </div>

                {/* Source and Tags */}
                <div className="flex flex-col self-start col-start-1 col-end-3 lg:row-start-2 mt-5 lg:mt-0">
                    <a href={item.source} className="mb-3">According to &quot;{item.source}&quot; a &quot;{item.name}&quot; weights {`${item.weight.isCa ? "ca." : ""}${item.weight.value}${item.weight.aditionalValue ? `- ${item.weight.aditionalValue}` : ""} g`}.</a>
                    <ul className="flex md:flex-wrap overflow-y-auto">
                        <li><div className="md:hidden absolute bg-gradient-to-r right-0 from-transparent to-white w-20 h-8 py-1"></div></li>
                        {item.tags.map((tag, index) => <li key={tag.name} className={`${index === item.tags.length - 1 ? "mr-20" : ""}`}><Tag to={tag.slug}>{tag.name}</Tag></li>)}
                    </ul>
                </div>

                {/* Weights Image */}
                <div className="row-start-1 lg:row-end-3 lg:flex lg:justify-end">
                    {/* No better way yet: https://github.com/vercel/next.js/discussions/21379 Let's take a look at this when we got problems with it */}
                    <Image src="https://picsum.photos/1200" priority className="sm:hidden rounded-xl" alt={item.name} width={120} height={120} />
                    <Image src="https://picsum.photos/1200" priority className="hidden sm:block rounded-xl" alt={item.name} width={230} height={230} />
                </div>
            </div>
        </div>
    </>
}

export const getStaticProps: GetStaticProps<WeightsSingleProps> = async (context) => {
    const slug = context.params ? context.params.slug : "1"
    const response = await fetch(`http://localhost:3004/api/query/v1/items/getOne?slug=${slug}`)
    const data = await response.json()

    // Validate Query
    if (!data.id) {
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