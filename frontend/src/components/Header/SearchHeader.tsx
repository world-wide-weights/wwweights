import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import { routes } from "../../services/routes/routes";
import { Search } from "../Form/Search/Search";

type SearchHeaderProps = {
    search: string
}

export const SearchHeader: React.FC<SearchHeaderProps> = ({ search }) => {
    const router = useRouter()

    const initialValues = {
        search: search
    }

    const submitForm = (values: typeof initialValues) => {
        router.push(routes.weights.list(values))
    }

    return <header className="bg-white pt-5 pb-10">
        <div className="container flex flex-col items-center">
            <h1 className="font-semibold text-3xl mb-2">Wie viel wiegt?</h1>
            <Formik initialValues={initialValues} onSubmit={submitForm}>
                <Form>
                    <div className="md:w-96">
                        <Search />
                    </div>
                </Form>
            </Formik>
        </div>
    </header>
}