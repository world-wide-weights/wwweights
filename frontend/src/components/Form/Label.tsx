type LabelProps = {
	/** The unique input name */
	name: string
	/** Inform users what the corresponding input fields mean. */
	labelText: string
	/** When set Required * will be seen  */
	labelRequired?: boolean
	/** For testing. */
	datacy?: string
}

/**
 * Label for Inputs
 * @example <Label name="name" labelText="Name" labelRequired={true} />
 */
export const Label: React.FC<LabelProps> = ({ name, labelText, labelRequired = false, datacy }) => (
	<>
		<label datacy={datacy} className="text-darkgray text-sm font-medium" htmlFor={name}>
			{labelText}
			{labelRequired && <span className="text-primary-blue ml-1">*</span>}
		</label>
	</>
)
