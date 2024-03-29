import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../../components/Auth/Auth"
import { CreateEdit } from "../../../components/Item/CreateEdit"
import { SkeletonLoadingEdit } from "../../../components/Loading/SkeletonLoadingEdit"
import { Seo } from "../../../components/Seo/Seo"
import { queryClientRequest } from "../../../services/axios/axios"
import { errorHandling } from "../../../services/utils/errorHandling"
import { Item } from "../../../types/item"
import { PaginatedResponse } from "../../../types/pagination"
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
	const [error, setError] = useState<string | undefined>()

	// Local variables
	const isLoadingEdit = isLoading || !isReady

	// Global State
	const { getSession } = useContext(AuthContext)

	// Check if item is owned by user
	useEffect(() => {
		// Wait till the router has finished loading
		if (!isReady) return

		const fetchItem = async () => {
			try {
				// Fetch item
				const itemResponse = await queryClientRequest.get<PaginatedResponse<Item>>(`/items/list?slug=${query.slug}`)
				const item = itemResponse.data.data[0]

				if (!item) return

				setItem(item)

				// Check if user is authenticated
				const session = await getSession()

				// Should never happen because of auth route
				/* istanbul ignore if */
				if (session === null) return

				setIsAuthenticated(session.decodedAccessToken.id === item.userId)
			} catch (error) {
				errorHandling(error)
			} finally {
				setIsLoading(false)
			}
		}
		fetchItem()
	}, [getSession, isReady, query.slug])

	if (isLoadingEdit) return <SkeletonLoadingEdit />

	if (!isAuthenticated || !item) return <Custom404 />

	if (error) return <Custom500 />

	return (
		<>
			{/* Meta Tags */}
			<Seo title={`Edit ${item.name}`} description="Improve contributions to the World Wide Weights database and update item." />

			{/* Page Content */}
			<CreateEdit item={item} />
		</>
	)
}

// Sets route need to be logged in
EditItem.auth = {
	routeType: "protected",
}

export default EditItem
