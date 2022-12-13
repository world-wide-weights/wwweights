import { Field, FieldProps } from "formik";
import { FormError } from "../../Errors/FormError";
import { Label } from "../Label";

type TextInputProps = {
    /** Gives the input a unique name */
    name: string
    /** Inform users what the corresponding input fields mean. */
    labelText?: string
    /** When set Required * will be seen  */
    labelRequired?: boolean
    /** Provides assistance on how to fill out a field. Helper text is optional. */
    helperText?: string
    /** Icon at the end of the input */
    icon?: string
} & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

/** 
 * Text Input, can only be used with Formik
 */
export const TextInput: React.FC<TextInputProps> = ({ name, labelText, labelRequired = false, helperText, type, icon, ...restProps }) => {
    return (
        <div className="mb-4">
            {labelText && <Label name={name} labelText={labelText} labelRequired={labelRequired} />}
            <Field type={type} name={name}>{(props: FieldProps<any>) => (
                <>
                    <div className="relative flex flex-col justify-center my-1">
                        {icon && <i className={`absolute material-symbols-rounded right-4 ${props.meta.error && props.meta.touched ? "text-red-500" : "text-gray-500"} `}>{icon}</i>}
                        <input datacy={`textinput-${name}-input`} {...restProps} {...props.field} className={`rounded-full pl-4 py-2 ${icon ? "pr-12" : ""} ${props.meta.error && props.meta.touched ? 'bg-red-500 bg-opacity-10 border-2 border-red-500 focus:outline-none focus:border-red-500 focus:ring-red-500' : 'border-2 border-gray-100 bg-gray-100'}`} />
                    </div>
                    {!(props.meta.error && props.meta.touched) && <p className="text-gray-600 mx-4">{helperText}</p>}
                </>
            )}</Field>
            <FormError field={name} />
        </div>
    )
}