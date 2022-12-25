import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import { routes } from "../../services/routes/routes";
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

    // Formik Initial Values
    const initialQueryValues = {
        query: query
    }

    // Formik On Submit Button
    const submitForm = (formValues: typeof initialQueryValues) => {
        router.push(routes.weights.list({ query: formValues.query }))
    }

    return <header className="bg-white pt-2 md:pt-5 pb-3 md:pb-10">
        <div className="container flex flex-col items-center">
            <h1 className="font-semibold text-xl md:text-3xl mb-2">Wie viel wiegt?</h1>
            <Formik initialValues={initialQueryValues} onSubmit={submitForm}>
                <Form className="w-full md:w-96">
                    <Search />
                </Form>
            </Formik>
        </div>
    </header>
}