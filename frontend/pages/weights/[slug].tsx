import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Image from "next/image";
import { Headline } from "../../components/Headline/Headline";

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

/** Single Page of a weight */
export default function WeightsSingle({ item }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return <>
        {/* Meta Tags */}
        <Head>
            <title>How much does {item.title} weight | WWWeights </title>
        </Head>

        <div className="container mt-20">
            <div className="flex items-center justify-between">
                {/* Meta Data Weights */}
                <div>
                    <Headline level={2}>{item.title}</Headline>
                    <h6 className="text-3xl md:text-5xl font-bold mb-4">130.000 - 150.000 kg</h6>
                    <p>Quelle: Wikpedia 15.05.2020</p>
                    {/* TODO (Zoe-Bot): Add tags when merged */}
                </div>

                {/* Weights Image */}
                <Image src="https://picsum.photos/1200" className="rounded-xl" alt={item.title} width={230} height={230} />
            </div>
        </div>
    </>
}

export const getServerSideProps: GetServerSideProps<WeightsSingleProps> = async (context) => {
    const slug = context.params ? context.params.slug : "1"
    const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${slug}`)
    const data = await response.json()

    return {
        props: {
            item: data
        }
    }
}