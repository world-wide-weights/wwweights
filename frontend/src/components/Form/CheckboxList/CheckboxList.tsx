import { Field } from "formik"
import { ComponentOptions } from "../../../types/options"
import { Icon } from "../../Icon/Icon"

type CheckboxProps = {
    /** Gives the input a unique name */
    name: string
    /** Inform users what the corresponding input fields mean. */
    labelText?: string
    /** Provides assistance on how to fill out a field. Helper text is optional. */
    helperText?: string
    /** A list of options to choose from. */
    options: ComponentOptions[]
}

/**
 * Checkbox, can only be used with Formik
 */
export const CheckboxList: React.FC<CheckboxProps> = ({ name, labelText, helperText, options }) => {
    return (
        <>
            <h5 className="block text-darkgrey font-semibold">{labelText}</h5>
            {options.map((option) => (
                <label data-cy={`${name}-option-${option.value}`} key={`${option.value}`} className="flex items-center my-1 cursor-pointer">
                    <Field type="checkbox" className="cursor-pointer mr-2" name={name} value={`${option.value}`} />
                    {option.icon && <Icon className="text-lightgrey mr-1">{option.icon}</Icon>}
                    <span className="text-darkgrey">{option.label}</span>
                </label>
            ))}
            {helperText && <small data-cy={`${name}-helpertext`} className="text-lightgrey text-sm mb-4">{helperText}</small>}
        </>
    )
}