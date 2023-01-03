import { Field, FieldProps } from "formik";
import { useState } from "react";
import { Icon } from "../../Icon/Icon";

type DropdownProps = {
    /** Gives the dropdown a unique name */
    name: string
    /** Text that informs the user what to expect in the list of dropdown options. */
    placeholder?: string
    /** A list of options to choose from. */
    options: ComponentOptions[]
    /** Set to true when dropdown needs to fit to other inputs (have lighter color) */
    light?: boolean
}

export type ComponentOptions = {
    /** Unique value of option. */
    value: number | string
    /** Label which is shown as option. */
    label: string
    /** Icon in front of label. */
    icon?: string
}

/**
 * Dropdown, can only be used with Formik
 */
export const Dropdown: React.FC<DropdownProps> = ({ name, placeholder, light = false, options }) => {
    const [isOpen, setIsOpen] = useState(false)

    return <Field name={name}>{(props: FieldProps<any>) => (
        <div className="relative mb-1">
            {/* When dropdown open click outside close it */}
            {isOpen && <div className="fixed cursor-pointer inset-0 h-full w-full z-10" aria-hidden="true" onClick={() => setIsOpen(false)}></div>}

            <button datacy={`${name}-dropdown-button`} className={`relative flex items-center justify-between rounded-lg mr-5 sm:mb-0 py-2 px-5 w-full border ${light ? "bg-gray-100 border-gray-100" : "bg-gray-200 border-gray-200"} ${!props.field.value ? "text-gray-500" : "text-gray-800"}`} type="button" onClick={() => setIsOpen(!isOpen)}>
                {props.field.value !== "" ? <span className="truncate">{options.find(option => option.value === props.field.value)?.label}</span> : <span>{placeholder}</span>}
                <Icon className={`transform-gpu transition-transform duration-200 ease-linear ml-6 ${isOpen ? "-rotate-180" : "rotate-0"}`}>expand_more</Icon>
            </button>

            {isOpen && <div datacy={`${name}-dropdown-menu`} className="absolute bg-white rounded-lg shadow-[-10px_10px_10px_rgba(203,210,217,0.10),10px_10px_10px_rgba(203,210,217,0.10)] z-10 w-full py-2" tabIndex={-1}>
                {options.map(option => (
                    <button key={option.value} datacy={`${name}-dropdown-option-${option.value}`} onClick={() => {
                        props.form.setFieldValue(props.field.name, option.value)
                        setIsOpen(false)
                    }} className={`flex items-center hover:text-blue-500 w-full px-5 py-2 ${props.field.value === option.value ? `text-blue-500` : "text-gray-700"}`}>
                        {option.icon && <Icon className="mr-2">{option.icon}</Icon>}
                        <span className="truncate pr-1">{option.label}</span>
                    </button>
                ))}
            </div>}
        </div>
    )}</Field>
}