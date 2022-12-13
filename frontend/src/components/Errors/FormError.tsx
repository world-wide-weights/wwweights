import { ErrorMessage } from "formik"

export type FormErrorProps = {
    /** unique name of formik field */
    field: string
    /** for testing */
    dataCy?: string
}

/**
 * Errormessage for inputs, can only be used with formik
 */
export const FormError: React.FunctionComponent<FormErrorProps> = (props) => {
    return (
        <ErrorMessage name={props.field} >
            {errorMessage => <div data-cy={props.dataCy} className="flex items-center text-red-500">
                <span className="material-symbols-rounded mr-2">error</span>
                <span className="font-semibold text-sm">{errorMessage}</span>
            </div>}
        </ErrorMessage>
    )
}