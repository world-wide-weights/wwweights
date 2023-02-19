import { ErrorMessage } from "formik"
import { Icon } from "../Icon/Icon"

export type FormErrorProps = {
    /** unique name of formik field */
    field: string
}

/**
 * Errormessage for inputs, can only be used with formik.
 * @example <FormError field="email" />
 */
export const FormError: React.FunctionComponent<FormErrorProps> = ({ field }) => {
    return (
        <ErrorMessage name={field} >
            {errorMessage => <div datacy={`formerror-${field}`} className="flex items-center text-red-500">
                <Icon className="mr-2">error</Icon>
                <span className="font-medium text-sm">{errorMessage}</span>
            </div>}
        </ErrorMessage>
    )
}