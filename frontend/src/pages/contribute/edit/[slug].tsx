import { GetStaticPaths, GetStaticProps, InferGetServerSidePropsType } from "next"
import { CreateEdit } from "../../../components/Item/CreateEdit"
import { queryRequest } from "../../../services/axios/axios"
import { Item, PaginatedResponse } from "../../../types/item"

type EditItemProps = {
    /** Item to edit. */
    item: Item
}

/**
 * Edit Item Page.
 */
function EditItem({ item }: InferGetServerSidePropsType<typeof getStaticProps>) {
    return <>
        <CreateEdit item={item} />
    </>
}

export const getStaticProps: GetStaticProps<EditItemProps> = async (context) => {
    const slug = context.params ? context.params.slug : ""

    try {
        // Fetch item and related items
        const itemResponse = await queryRequest.get<PaginatedResponse<Item>>(`/items/list?slug=${slug}`)

        // Items and RelatedItems
        const item = itemResponse.data.data[0]

        // Validate Query
        if (!item) {
            return {
                notFound: true // Renders 404 page
            }
        }

        return {
            props: {
                item,
            },
            revalidate: 10
        }
    } catch (error) {
        throw new Error("Something went wrong.")
    }
}

export const getStaticPaths: GetStaticPaths = () => {
    return {
        paths: [],
        fallback: "blocking"
    }
}

// Sets route need to be logged in
EditItem.auth = {
    routeType: "protected"
}

export default EditItem