import { GetStaticPaths, GetStaticProps, InferGetServerSidePropsType } from "next"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../../components/Auth/Auth"
import { CreateEdit } from "../../../components/Item/CreateEdit"
import { Seo } from "../../../components/Seo/Seo"
import { queryServerRequest } from "../../../services/axios/axios"
import { Item, PaginatedResponse } from "../../../types/item"
import Custom404 from "../../404"

type EditItemProps = {
    /** Item to edit. */
    item: Item
}

/**
 * Edit Item Page.
 */
function EditItem({ item }: InferGetServerSidePropsType<typeof getStaticProps>) {
    // Local State
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

    // Global State
    const { getSession } = useContext(AuthContext)

    // Check if item is owned by user
    useEffect(() => {
        const getIsAuthenticated = async () => {
            const session = await getSession()

            if (session?.decodedAccessToken.id === item.userId) {
                setIsAuthenticated(true)
            }
        }
        getIsAuthenticated()
    }, [getSession, item.userId])

    // If not authenticated, render 404
    if (!isAuthenticated) {
        return <Custom404 />
    }

    return <>
        {/* Meta Tags */}
        <Seo
            title={`Edit ${item.name}`}
            description="Improve contributions to the World Wide Weights database and update item."
        />

        {/* Page Content */}
        <CreateEdit item={item} />
    </>
}

export const getStaticProps: GetStaticProps<EditItemProps> = async (context) => {
    const slug = context.params ? context.params.slug : ""

    try {
        // Fetch item
        const itemResponse = await queryServerRequest.get<PaginatedResponse<Item>>(`/items/list?slug=${slug}`)

        // Item
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