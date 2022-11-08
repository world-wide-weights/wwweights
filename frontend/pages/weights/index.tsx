import { GetServerSideProps, InferGetServerSidePropsType } from "next"
import Head from "next/head"
import Link from "next/link"
import { Headline } from "../../components/Headline/Headline"
import { ItemPreview } from "../../components/Item/ItemPreview"

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
    return (<div className="container">
        <Head>
            <title>Page {currentPage} - Discover weights</title>
        </Head>
        <Headline level={3}>All weights</Headline>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {items.map((item) => <ItemPreview key={item.id} name={item.title} weight={item.completed ? "✓" : "X"} imageUrl="https://via.placeholder.com/96.png" id={item.id.toString()} />)}
        </div>

        <div className="flex justify-center mt-5 md:mt-20">
            {currentPage > 0 && <Link className="mr-3" href={`/weights?page=${currentPage - 1}&limit=${limit}`}>Previous</Link>}
            <Link href={`/weights?page=${currentPage + 1}&limit=${limit}`}>Next</Link>
        </div>
    </div>
    )
}

export const getServerSideProps: GetServerSideProps<WeightsListProps> = async (context) => {
    const currentPage = parseInt(context.query?.page as string ?? "0")
    const limit = parseInt(context.query?.limit as string ?? "15")
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
