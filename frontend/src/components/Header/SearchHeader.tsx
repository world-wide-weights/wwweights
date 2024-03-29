import { Form, Formik, useFormikContext } from "formik"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { queryClientRequest } from "../../services/axios/axios"
import { routes } from "../../services/routes/routes"
import { PaginatedResponse } from "../../types/pagination"
import { Tag } from "../../types/tag"
import { Chip } from "../Chip/Chip"
import { Headline } from "../Headline/Headline"
import { Search } from "../Search/Search"
import { SortType } from "../Sort/Sort"

type SearchHeaderProps = {
	/** Search query. */
	query?: string
	/** Sort type of items. */
	sort?: SortType
	/** When true display "How much weigh?" headline. */
	hasHeadline?: boolean
	/** When true display related tags. */
	hasRelatedTags?: boolean
}

/**
 * Header with search and suggestions.
 * @example <SearchHeader />
 */
export const SearchHeader: React.FC<SearchHeaderProps> = ({ query = "", sort = "relevance", hasHeadline = true, hasRelatedTags = true }) => {
	const router = useRouter()

	// Local States
	const [relatedTags, setRelatedTags] = useState<Tag[]>([])
	const [isLoadingRelatedTags, setIsLoadingRelatedTags] = useState(false)

	// Formik Initial Values
	const initialQueryValues = {
		query: "",
	}

	/**
	 * Formik function calls when form is submitted.
	 * Will redirect to items list with the given query
	 * @param formValues
	 */
	const submitForm = (formValues: typeof initialQueryValues) => {
		router.push(routes.weights.list({ sort, query: formValues.query }))
	}

	/**
	 * Always update field according to url
	 * so its working correct when going back with back keys or click on tag
	 * needs to be called inside formik for formikcontext working
	 */
	const AutoUpdateQueryField = (): null => {
		const { setFieldValue } = useFormikContext()
		useEffect(() => {
			const tag = relatedTags.find((relatedTag) => relatedTag.name === query)
			let queryField = query

			if (tag) queryField = tag.name

			// Set query field to tagname when defined otherwise set to current query in url
			setFieldValue("query", queryField)
		}, [setFieldValue])
		return null
	}

	// Fetch related tags when query is not empty and related tags are enabled
	useEffect(() => {
		// Don't fetch when query is empty or related tags are disabled
		if (query === "" || !hasRelatedTags) return

		const getRelatedTags = async () => {
			setIsLoadingRelatedTags(true)

			try {
				const response = await queryClientRequest.get<PaginatedResponse<Tag>>(`/tags/related?query=${query}`)
				const relatedTags = response.data.data

				setRelatedTags(relatedTags)
			} catch (error) {
				// Display no error message here to the user since it's not mandatory
				console.error(error)
			} finally {
				setIsLoadingRelatedTags(false)
			}
		}
		getRelatedTags()
	}, [query, hasRelatedTags])

	return (
		<header className="bg-white pt-2 md:pt-5 pb-3 md:pb-10">
			<div className="container">
				<div className="md:flex md:flex-col md:items-center">
					{hasHeadline && (
						<Headline level={2} size="text-2xl md:text-3xl" className="text-center">
							How much weighs?
						</Headline>
					)}
					<Formik initialValues={initialQueryValues} onSubmit={submitForm}>
						<Form>
							{/* Search */}
							<div className="md:flex md:justify-center">
								<div className="md:w-96">
									<Search />
								</div>
							</div>

							{/* Related Tags */}
							{query !== "" &&
								hasRelatedTags &&
								(isLoadingRelatedTags ? (
									<></>
								) : (
									<div datacy="search-header-tag-wrapper" className="whitespace-nowrap overflow-x-scroll md:whitespace-normal md:overflow-hidden">
										{/* Only show tags not current searched (should not be the value in query field) */}
										{relatedTags.map(
											(relatedTag, index) =>
												relatedTag.name !== query && (
													<Chip
														datacy={`search-header-chip-${index}`}
														key={relatedTag.name}
														to={routes.weights.list({
															sort,
															query: relatedTag.name,
														})}
													>
														{relatedTag.name}
													</Chip>
												)
										)}
										<Chip to={routes.tags.list()}>All tags</Chip>
									</div>
								))}

							<AutoUpdateQueryField />
						</Form>
					</Formik>
				</div>
			</div>
		</header>
	)
}
