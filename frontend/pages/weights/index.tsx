import { GetServerSideProps, InferGetServerSidePropsType } from "next"
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
    currentPage: number,
    limit: number
}

/** Base List for weights */
export default function WeightsList({ items, currentPage, limit }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (<>
        <Head>
            <title>Page {currentPage} - Discover weights</title>
        </Head>
        <div>
            {items.map((item) => <div key={item.id}>
                <h1>{item.id}: {item.title} {item.completed ? "✓" : "X"}</h1>
            </div>)}
            {currentPage > 0 && <Link href={`/weights?page=${currentPage - 1}&limit=${limit}`}>Previous</Link>}
            <Link href={`/weights?page=${currentPage + 1}&limit=${limit}`}>Next</Link>
        </div>
    </>
    )
}

export const getServerSideProps: GetServerSideProps<WeightsListProps> = async (context) => {
    const currentPage = parseInt(context.query?.page as string ?? "0")
    const limit = parseInt(context.query?.limit as string ?? "5")
    const response = await fetch(`https://jsonplaceholder.typicode.com/todos?_start=${currentPage * limit}&_limit=${limit}`)
    const data = await response.json()
    return {
        props: {
            items: data,
            currentPage,
            limit
        }
    }
}
