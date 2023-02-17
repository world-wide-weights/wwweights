import { isAxiosError } from "axios"
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../../components/Auth/Auth"
import { CreateEdit } from "../../../components/Item/CreateEdit"
import { SkeletonLoadingEdit } from "../../../components/Loading/SkeletonLoadingEdit"
import { Seo } from "../../../components/Seo/Seo"
import { queryServerRequest } from "../../../services/axios/axios"
import { Item, PaginatedResponse } from "../../../types/item"
import Custom404 from "../../404"
import Custom500 from "../../500"

/**
 * Edit Item Page.
 */
const EditItem = () => {
    // Router
    const { query, isReady } = useRouter()

    // Local State
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
    const [item, setItem] = useState<Item | undefined>()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | undefined>(undefined)

    // Local variables
    const isLoadingEdit = !item || isLoading || !isReady

    // Global State
    const { getSession } = useContext(AuthContext)

    // Check if item is owned by user
    useEffect(() => {
        // Wait till the router has finished loading
        if (!isReady)
            return

        const fetchItem = async () => {
            try {
                // Fetch item
                const itemResponse = await queryServerRequest.get<PaginatedResponse<Item>>(`/items/list?slug=${query.slug}`)
                const item = itemResponse.data.data[0]
                setItem(item)

                if (!item)
                    return

                // Check if user is authenticated
                const session = await getSession()
                if (session?.decodedAccessToken.id === item.userId) {
                    setIsAuthenticated(true)
                }
            } catch (error) {
                isAxiosError(error) && error.response ? setError(error.response.data.message) : setError("Netzwerk-Zeitüberschreitung")
                console.error(error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchItem()
    }, [getSession, isReady, query.slug])

    if (isLoadingEdit)
        return <SkeletonLoadingEdit />

    if (!isAuthenticated || !item) {
        return <Custom404 />
    }

    if (error)
        return <Custom500 />

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

// Sets route need to be logged in
EditItem.auth = {
    routeType: "protected"
}

export default EditItem