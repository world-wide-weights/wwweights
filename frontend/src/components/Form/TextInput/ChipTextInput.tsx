import { Field, FieldArray, FieldProps, useFormikContext } from "formik"
import React, { Fragment } from "react"
import { Chip } from "../../Chip/Chip"
import { Icon } from "../../Icon/Icon"
import { Label } from "../Label"

type ChipTextInputProps = {
	/** Gives the input a unique name. */
	name: string
	/** Inform users what the corresponding input fields mean. */
	labelText?: string
	/** When set Required * will be seen. */
	labelRequired?: boolean
}

/**
 * Chip Text Input, can only be used with Formik
 * Text input with chips
 */
export const ChipTextInput: React.FC<ChipTextInputProps> = ({ name, labelRequired, labelText }) => {
	// Formik Context
	const { values, errors } = useFormikContext<any>()

	return <FieldArray name={name}>{(arrayHelpers) => {
		/**
		 * Removes a chip from the array
		 * @param indexToRemove Index of the chip to remove
		 */
		const removeChip = (indexToRemove: number): void => {
			arrayHelpers.remove(indexToRemove)
		}

		/**
		 * Adds a chip to the array
		 * @param event the keyboard event
		 */
		const addChip = (event: React.KeyboardEvent<HTMLInputElement>): void => {
			const submitKeys = ["Enter", ","]
			if (!submitKeys.includes(event.key))
				return
			const chipInput = (event.target as HTMLInputElement)

			const chipValue = chipInput.value.split(",")
			chipValue.forEach((chip) => {
				if (chip.trim() !== "") {
					arrayHelpers.push(chip.trim())
				}
			})
			chipInput.value = ""
		}

		/**
		 * Handles deleting the last chip when click backspace
		 * @param event keyboard event
		 */
		const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
			if (event.key === "Backspace" && event.currentTarget.value === "")
				arrayHelpers.pop()
		}

		return <div>
			{labelText && <Label name={name} labelText={labelText} labelRequired={labelRequired} />}
			<div className="mb-2 md:mb-4">
				<div className="border-2 border-gray-100 bg-gray-100 rounded-lg px-2 pt-2 mb-2">
					{/* Chips */}
					{values[name] && values[name].map((chip: string, index: number) => <Fragment key={index}>
						<Field name={`${name}.${index}`}>
							{(props: FieldProps) => <>
								<input className="hidden" />
								<Chip key={index} iconEnd="close" color={props.form.errors[name]?.[index as keyof typeof props.form.errors.name] ? "red" : undefined} onClick={() => removeChip(index)}>{chip}</Chip>
							</>}
						</Field>
					</Fragment>)}

					{/* Input */}
					<input className="focus-visible:outline-none placeholder:text-gray-400 border-2 border-gray-100 bg-gray-100" onKeyDown={handleKeyDown} onKeyUp={addChip} />
				</div>

				{/* Error Messages */}
				{(errors[name] as string[])?.map((error: string, index: number) => error && <div key={index} className="flex items-center text-red-500">
					<Icon className="mr-2">error</Icon>
					<span className="font-medium text-sm">{values.tags[index]}{error.slice(error.indexOf("]") + 1)}</span>
				</div>)}
			</div>
		</div>
	}}
	</FieldArray>
}