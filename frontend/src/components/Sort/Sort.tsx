import { Formik, useFormikContext } from "formik"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { routes, SortType } from "../../services/routes/routes"
import { Dropdown } from "../Form/Dropdown/Dropdown"

type SortProps = {
    /** Sort type of items. */
    sort: SortType
    /** Search query. */
    query: string
}

const sortDropdownOptions = [
    {
        value: "asc",
        label: "Heaviest",
        icon: "face"
    }, {
        value: "desc",
        label: "Lightest",
        icon: "face"
    },
]

/** 
 * Sort Dropdown with sort logic
 */
export const Sort: React.FC<SortProps> = ({ sort, query }) => {
    const router = useRouter()

    // Formik initial state
    const initialSortValues: { sort: SortType } = {
        sort
    }

    /**
     * Formik function calls when form is submitted.
     * Will redirect to items list with the given sort type
     * @param formValues 
     */
    const submitForm = (formValues: typeof initialSortValues) => {
        router.push(routes.weights.list({ query, sort: formValues.sort }))
    }

    /**
     * Submit form when dropdown value change
     * needs to be called inside formik for formikcontext working
     */
    const SortDropdownChangeListener = () => {
        const { submitForm, values } = useFormikContext<{ sort: SortType }>()
        const [lastValues, setLastValues] = useState(values)

        useEffect(() => {
            // Update values last state when change
            if (lastValues !== values) {
                setLastValues(values)
            }

            // When state updated and not initialvalue submit form
            if (lastValues !== values && values !== initialSortValues) {
                submitForm()
            }
        }, [values, submitForm])

        return null
    }

    return <Formik initialValues={initialSortValues} onSubmit={submitForm}>
        <>
            {/* TODO (Zoe-Bot): Fix bug when change dropdown and go back with arrows update dropdown */}
            <Dropdown name="sort" options={sortDropdownOptions} />
            <SortDropdownChangeListener />
        </>
    </Formik>
}