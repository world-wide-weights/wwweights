type LabelProps = {
    /** The unique input name */
    name: string
    /** Inform users what the corresponding input fields mean. */
    labelText: string
    /** When set Required * will be seen  */
    labelRequired?: boolean
}

/** 
 * Label for Inputs
 */
export const Label: React.FC<LabelProps> = ({ name, labelText, labelRequired = false }) => <label className="text-darkgray text-sm font-semibold" htmlFor={name}>{labelText}{labelRequired && <span className="text-primary-blue ml-1">*</span>}</label>