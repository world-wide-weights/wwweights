import { Form, Formik, useFormikContext } from "formik"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { queryRequest } from "../../services/axios/axios"
import { routes } from "../../services/routes/routes"
import { PaginatedResponse } from "../../types/item"
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
}

/**
 * Header with search and search suggestions
 */
export const SearchHeader: React.FC<SearchHeaderProps> = ({ query = "", sort = "relevance", hasHeadline = true }) => {
    const router = useRouter()

    // Local States
    const [relatedTags, setRelatedTags] = useState<Tag[]>([])
    const [isLoadingRelatedTags, setIsLoadingRelatedTags] = useState(false)

    // Formik Initial Values
    const initialQueryValues = {
        query: ""
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
            const tag = relatedTags.find(relatedTag => relatedTag.name === query)
            let queryField = query

            if (tag)
                queryField = tag.name

            // Set query field to tagname when defined otherwise set to current query in url
            setFieldValue("query", queryField)
        }, [setFieldValue])
        return null
    }

    /**
     * Fetch related tags
     */
    useEffect(() => {
        const getRelatedTags = async () => {
            setIsLoadingRelatedTags(true)

            try {
                const response = await queryRequest.get<PaginatedResponse<Tag>>("/tags/related")
                const relatedTags = response.data.data

                setRelatedTags(relatedTags)
            } catch (error) {
                console.error(error)
            } finally {
                setIsLoadingRelatedTags(false)
            }
        }
        getRelatedTags()
    }, [])

    return <header className="bg-white pt-2 md:pt-5 pb-3 md:pb-10">
        <div className="container">
            <div className="md:flex md:flex-col md:items-center">
                {hasHeadline && <Headline level={2} size="text-2xl md:text-3xl" className="text-center">How much weighs?</Headline>}
                <Formik initialValues={initialQueryValues} onSubmit={submitForm}>
                    <Form>
                        <div className="md:flex md:justify-center">
                            <div className="md:w-96">
                                <Search />
                            </div>
                        </div>
                        {/* TODO (Zoe-bot): Loading Component and scrollable tags */}
                        {query !== "" && (isLoadingRelatedTags ? <p>Loading...</p> : <div datacy="search-header-tag-wrapper" className="whitespace-nowrap overflow-x-scroll md:whitespace-normal md:overflow-hidden">
                            {/* Only show tags not current searched (should not be the value in query field) */}
                            {relatedTags.map((relatedTag, index) => relatedTag.name !== query && <Chip datacy={`search-header-chip-${index}`} key={relatedTag.name} to={routes.weights.list({ sort, query: relatedTag.name })}>{relatedTag.name}</Chip>)}
                        </div>)}
                        <AutoUpdateQueryField />
                    </Form>
                </Formik>
            </div>
        </div>
    </header>
}