import { Field, FieldProps } from "formik";
import { useState } from "react";

type DropdownProps = {
    /** Gives the dropdown a unique name */
    name: string
    /** Text that informs the user what to expect in the list of dropdown options. */
    placeholder: string
    /** A list of options to choose from. */
    options: ComponentOptions[]
}

export type ComponentOptions = {
    id: number | string
    label: string
    icon?: string
}

/**
 * Dropdown, can only be used with Formik
 */
export const Dropdown: React.FC<DropdownProps> = ({ name, placeholder, options }) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="mb-4">
            <Field name={name}>{(props: FieldProps<any>) => (
                <div className="relative mb-1">
                    {/* When dropdown open click outside close it */}
                    {isOpen && <div className="fixed cursor-pointer inset-0 h-full w-full z-10" aria-hidden="true" onClick={() => setIsOpen(false)}></div>}

                    <button data-cy={`${name}-dropdown-button`} className={`relative flex items-center justify-between rounded-lg mr-5 sm:mb-0 py-2 px-5 w-full border border-grey-200 bg-grey-200 ${!props.field.value ? "text-grey-500" : "text-grey-800"}`} type="button" onClick={() => setIsOpen(!isOpen)}>
                        {props.field.value !== "" ? <span className="truncate">{options.find(option => option.id === props.field.value)?.label}</span> : <span>{placeholder}</span>}
                        <i className={`material-symbols-rounded transform-gpu transition-transform duration-200 ease-linear ml-6 ${isOpen ? "-rotate-180" : "rotate-0"}`}>expand_more</i>
                    </button>

                    {isOpen && <div data-cy={`${name}-dropdown-menu`} className="absolute bg-white rounded-lg shadow-[-10px_10px_10px_rgba(203,210,217,0.10),10px_10px_10px_rgba(203,210,217,0.10)] z-10 w-full py-2" tabIndex={-1}>
                        {options.map(option => (
                            <button key={option.id} data-cy={`${name}-dropdown-option-${option.id}`} onClick={() => {
                                props.form.setFieldValue(props.field.name, option.id)
                                setIsOpen(false)
                            }} className={`flex items-center hover:text-blue-500 w-full px-5 py-2 ${props.field.value === option.id ? `text-blue-500` : "text-grey-700"}`}>
                                {option.icon && <i className="material-symbols-rounded mr-2">{option.icon}</i>}
                                <span className="truncate pr-1">{option.label}</span>
                            </button>
                        ))}
                    </div>}
                </div>
            )}</Field>
        </div>
    )
}