import { GetStaticPaths, GetStaticProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Image from "next/image";
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
    item: Todo
}

const tags = [{
    name: "tag testststststststst 1",
    link: "/tags/1"
}, {
    name: "tag testststststststst 2",
    link: "/tags/2"
}, {
    name: "tag 3",
    link: "/tags/3"
}, {
    name: "tag 4",
    link: "/tags/4"
}, {
    name: "tag testststststststst 5",
    link: "/tags/5"
}, {
    name: "tag testststststststst 6",
    link: "/tags/6"
}]

/** Single Page of a weight */
export default function WeightsSingle({ item }: InferGetServerSidePropsType<typeof getStaticProps>) {
    const siteTitle = `${item.title} Weight | WWWeights`

    return <>
        {/* Meta Tags */}
        <Head>
            <title>{siteTitle}</title>
        </Head>

        <div className="container mt-10 md:mt-20">
            <div className="grid grid-cols-[120px_1fr] md:grid-cols-[250px_1fr] items-center lg:grid-cols-2">
                {/* Headline and Weight */}
                <div className="lg:col-start-1 lg:col-end-3 pl-5 lg:pl-0 md:mt-5">
                    <Headline level={3}>{item.title}</Headline>
                    <h6 className="text-2xl sm:text-4xl lg:text-5xl font-bold md:mb-5">130.000 - 150.000 kg</h6>
                </div>

                {/* Source and Tags */}
                <div className="flex flex-col self-start col-start-1 col-end-3 lg:row-start-2 mt-5 lg:mt-0">
                    <p className="mb-3">Quelle: Wikpedia 15.05.2020</p>
                    <ul className="flex md:flex-wrap overflow-y-auto">
                        <li><div className="md:hidden absolute bg-gradient-to-r right-0 from-transparent to-white w-20 h-8 py-1"></div></li>
                        {tags.map((tag, index) => <li className={`${index === tags.length - 1 ? "mr-20" : ""}`}><Tag to={tag.link}>{tag.name}</Tag></li>)}
                    </ul>
                </div>

                {/* Weights Image */}
                <div className="row-start-1 lg:row-end-3 lg:flex lg:justify-end">
                    <Image src="https://picsum.photos/1200" priority className="sm:hidden rounded-xl" alt={item.title} width={120} height={120} />
                    <Image src="https://picsum.photos/1200" priority className="hidden sm:block rounded-xl" alt={item.title} width={230} height={230} />
                </div>
            </div>
        </div>
    </>
}

export const getStaticProps: GetStaticProps<WeightsSingleProps> = async (context) => {
    const slug = context.params ? context.params.slug : "1"
    const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${slug}`)
    const data = await response.json()

    // Validate Query
    if (!data) {
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