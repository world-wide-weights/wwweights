import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Tag } from "../../pages/tags";
import { routes } from "../../services/routes/routes";
import { Chip } from "../Chip/Chip";
import { Search } from "../Form/Search/Search";

type SearchHeaderProps = {
    /** Search query. */
    query: string
}

/**
 * Header with search and search suggestions
 */
export const SearchHeader: React.FC<SearchHeaderProps> = ({ query }) => {
    const router = useRouter()
    const [relatedTags, setRelatedTags] = useState<Tag[]>([])
    const [isLoadingRelatedTags, setIsLoadingRelatedTags] = useState(false)

    // Formik Initial Values
    const initialQueryValues = {
        query: ""
    }

    // Formik On Submit Button
    const submitForm = (formValues: typeof initialQueryValues) => {
        router.push(routes.weights.list({ query: formValues.query }))
    }

    useEffect(() => {
        setIsLoadingRelatedTags(true)
        const fetchRelatedTags = async () => {
            const response = await fetch(`http://localhost:3004/api/query/v1/tags/related`)
            const data = await response.json()
            setRelatedTags(data)
        }
        fetchRelatedTags().then(() => setIsLoadingRelatedTags(false))
    }, [])

    return <header className="bg-white pt-2 md:pt-5 pb-3 md:pb-10">
        <div className="container">
            <div className="md:flex md:flex-col md:items-center">
                <h1 className="font-semibold text-xl text-center md:text-3xl mb-2">Wie viel wiegt?</h1>
                <Formik initialValues={initialQueryValues} onSubmit={submitForm}>
                    <Form>
                        <div className="md:flex md:justify-center">
                            <div className="md:w-96">
                                <Search />
                            </div>
                        </div>
                        <div className="whitespace-nowrap overflow-x-scroll md:whitespace-normal md:overflow-hidden">
                            {relatedTags.map(relatedTag => <Chip key={relatedTag.slug} to={routes.weights.list({ query: relatedTag.slug })}>{relatedTag.name}</Chip>)}
                        </div>
                    </Form>
                </Formik>
            </div>
        </div>
    </header>
}