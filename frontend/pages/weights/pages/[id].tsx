import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next"
import Head from "next/head"
import Link from "next/link"

// As long as we do not have a weight. Let's work with Todo
type Todo = {
    userId: number
    id: number
    title: string
    completed: boolean
}

type WeightsListProps = {
    items: Todo[],
    currentPage: number
}

/** Base List for weights */
export default function WeightsList({ items, currentPage }: InferGetStaticPropsType<typeof getStaticProps>) {
    return (<>
        <Head>
            <title>Page {currentPage} - Discover weights</title>
        </Head><div>
            {items.map((item) => <div key={item.id}>
                <h1>{item.id}: {item.title} {item.completed ? "✓" : "X"}</h1>
            </div>)}
            {currentPage > 1 && <Link href={`/weights/pages/${currentPage - 1}`}>Previous</Link>}
            <Link href={`/weights/pages/${currentPage + 1}`}>Next</Link>
        </div>
    </>
    )
}

export const getStaticProps: GetStaticProps<WeightsListProps> = async (context) => {
    const currentPage = parseInt(context.params?.id as string ?? "0")
    const response = await fetch(`https://jsonplaceholder.typicode.com/todos?_start=${currentPage * 5}&_limit=5`)
    const data = await response.json()
    return {
        props: {
            items: data,
            currentPage
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