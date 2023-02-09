import { Formik, useFormikContext } from "formik"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { routes } from "../../services/routes/routes"
import { Dropdown } from "../Form/Dropdown/Dropdown"

type SortProps = {
    /** Sort type of items. */
    sort: SortType
    /** Search query. */
    query: string
}

export type SortType = "relevance" | "heaviest" | "lightest"

const sortDropdownOptions = [
    {
        value: "relevance",
        label: "Relevance",
        icon: "sort"
    },
    {
        value: "heaviest",
        label: "Heaviest",
        icon: "weight"
    }, {
        value: "lightest",
        label: "Lightest",
        icon: "eco"
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
     * Submit form when dropdown value change and keep field value updated correct when change link.
     * Needs to be called inside formik for formikcontext working.
     */
    const SortDropdownChangeListener = () => {
        const { submitForm, values, setFieldValue } = useFormikContext<{ sort: SortType }>()
        const [lastValues, setLastValues] = useState(values)

        /** Submit form when value change */
        useEffect(() => {
            // Update values last state when change and submit form
            if (lastValues !== values) {
                setLastValues(values)
                submitForm()
            }
        }, [values, lastValues, submitForm])

        /** Keep form value up to date */
        useEffect(() => {
            if (sort !== values.sort)
                setFieldValue("sort", sort)
        }, [setFieldValue]) // eslint-disable-line react-hooks/exhaustive-deps

        return null
    }

    return <Formik initialValues={initialSortValues} onSubmit={submitForm}>
        <>
            <Dropdown name="sort" options={sortDropdownOptions} />
            <SortDropdownChangeListener />
        </>
    </Formik>
}