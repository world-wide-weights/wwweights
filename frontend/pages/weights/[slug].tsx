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
            <div className="grid items-center grid-cols-2">
                {/* Headline and Weight */}
                <div className="md:col-start-1 md:col-end-3 pl-5 sm:pl-0 md:pl-0 md:mt-5">
                    <Headline level={3}>{item.title}</Headline>
                    <h6 className="text-2xl sm:text-3xl lg:text-5xl font-bold">130.000 - 150.000 kg</h6>
                </div>

                {/* Source and Tags */}
                <div className="flex flex-col self-start col-start-1 col-end-3 md:row-start-2 mt-5 md:mt-0">
                    <p>Quelle: Wikpedia 15.05.2020</p>
                    {/* TODO (Zoe-Bot): Add tags when merged */}
                    <div>
                        <span>tag 1</span>
                        <span>tag 2</span>
                        <span>tag 3</span>
                    </div>
                </div>

                {/* Weights Image */}
                <div className="row-start-1 md:row-end-3 md:flex md:justify-end">
                    <Image src="https://picsum.photos/1200" className="rounded-xl" alt={item.title} width={230} height={230} />
                </div>
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