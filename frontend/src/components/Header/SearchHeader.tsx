import { Form, Formik, useFormikContext } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Tag } from "../../pages/tags";
import { routes } from "../../services/routes/routes";
import { Chip } from "../Chip/Chip";
import { Search } from "../Form/Search/Search";

type SearchHeaderProps = {
    /** Search query. */
    query?: string
}

/**
 * Header with search and search suggestions
 */
export const SearchHeader: React.FC<SearchHeaderProps> = ({ query = "" }) => {
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
        router.push(routes.weights.list({ query: formValues.query }))
    }

    /**
     * Always update field according to url 
     * so its working correct when going back with back keys or click on tag
     * needs to be called inside formik for formikcontext working
     */
    const AutoUpdateQueryField = (): null => {
        const { setFieldValue } = useFormikContext()
        useEffect(() => {
            const tag = relatedTags.find(relatedTag => relatedTag.slug === query)
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
        const fetchRelatedTags = async () => {
            setIsLoadingRelatedTags(true)

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/query/v1/tags/related`)
                const data = await response.json()
                setRelatedTags(data)
                setIsLoadingRelatedTags(false)
            } catch (error) {
                console.error(error)
            }
        }
        fetchRelatedTags()
    }, [])

    return <header className="bg-white pt-2 md:pt-5 pb-3 md:pb-10">
        <div className="container">
            <div className="md:flex md:flex-col md:items-center">
                <h1 className="font-semibold text-xl text-center md:text-3xl mb-2">Wie viel wiegt?</h1>
                <Formik initialValues={initialQueryValues} onSubmit={submitForm}>
                    {({ values }) => (
                        <Form>
                            <div className="md:flex md:justify-center">
                                <div className="md:w-96">
                                    <Search />
                                </div>
                            </div>
                            {/* TODO(Zoe-bot): Loading Component and scrollable tags */}
                            {/* TODO(Zoe-bot): Only develop Remove query !== "" condition when normal backend api is set */}
                            {query !== "" && (isLoadingRelatedTags ? <p>Loading...</p> : <div datacy="search-header-tag-wrapper" className="whitespace-nowrap overflow-x-scroll md:whitespace-normal md:overflow-hidden">
                                {/* Only show tags not current searched (should not be the value in query field) */}
                                {relatedTags.map(relatedTag => relatedTag.name !== values.query && <Chip key={relatedTag.slug} to={routes.weights.list({ query: relatedTag.slug })}>{relatedTag.name}</Chip>)}
                            </div>)}
                            <AutoUpdateQueryField />
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    </header >
}