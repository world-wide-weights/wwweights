import { GetStaticPropsContext, InferGetStaticPropsType } from "next"

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

export const getStaticProps = async (context: GetStaticPropsContext) => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/photos?_start=${parseInt(context.params?.id as string ?? 1) * 5}&_limit=5`)
    const data = await response.json()
    return {
        props: {
            items: data
        }
    }
}

export const getStaticPaths = () => {
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
        fallback: false
    }
}