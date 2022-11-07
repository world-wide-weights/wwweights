import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next"

const WeightsList = ({ items }: InferGetStaticPropsType<typeof getStaticProps>) => {
    return (
        <div>
            {items.map((item: any) => <div key={item.id}>
                <h1>{item.title}</h1>
            </div>)}
        </div>
    )
}

export default WeightsList

type Todo = {
    userId: number
    id: number
    title: string
    completed: boolean
}

export const getStaticProps: GetStaticProps = async (context) => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/todos?_start=${parseInt(context.params?.id as string ?? 1) * 5}&_limit=5`)
    const data: Todo[] = await response.json()
    return {
        props: {
            items: data
        },
        revalidate: 10
    }
}

export const getStaticPaths: GetStaticPaths = () => {
    return {
        paths: [{
            params: {
                id: "1"
            }
        }, {
            params: {
                id: "2"
            }
        }],
        fallback: "blocking"
    }
}