import { ErrorMessage } from "formik"
import { Icon } from "../Icon/Icon"

export type FormErrorProps = {
    /** unique name of formik field */
    field: string
    /** for testing */
    datacy?: string
}

/**
 * Errormessage for inputs, can only be used with formik
 */
export const FormError: React.FunctionComponent<FormErrorProps> = ({ field, datacy}) => {
    return (
        <ErrorMessage name={field} >
            {errorMessage => <div datacy={datacy} className="flex items-center text-red-500">
                <Icon className="mr-2">error</Icon>
                <span className="font-medium text-sm">{errorMessage}</span>
            </div>}
        </ErrorMessage>
    )
}