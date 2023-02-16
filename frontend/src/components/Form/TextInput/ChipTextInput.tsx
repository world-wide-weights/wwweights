import { Field, FieldArray, useFormikContext } from "formik"
import React, { Fragment } from "react"
import { Chip } from "../../Chip/Chip"
import { FormError } from "../../Errors/FormError"

type ChipTextInputProps = {
	/** Gives the input a unique name */
	name: string
}

/**
 * Chip Text Input, can only be used with Formik
 * Text input with chips
 */
export const ChipTextInput: React.FC<ChipTextInputProps> = ({ name }) => {
	// Formik Context
	const { values } = useFormikContext<any>()

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
			const tagInput = (event.target as HTMLInputElement)

			const tagValue = tagInput.value.split(",")
			tagValue.forEach((tag) => {
				if (tag.trim() !== "") {
					arrayHelpers.push(tag.trim())
				}
			})
			tagInput.value = ""
		}

		/**
		 * Handles deleting the last chip when click backspace
		 * @param event keyboard event
		 */
		const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
			if (event.key === "Backspace" && event.currentTarget.value === "")
				arrayHelpers.pop()
		}

		return <>
			{values[name] && values[name].map((tag: string, index: number) => <Fragment key={index}>
				<Field name={`${name}.${index}`}>
					{(props: any) => <>
						<input className="hidden" />
						<Chip key={index} iconEnd="close" onClick={() => removeChip(index)}>{tag}</Chip>
						<FormError field={`${name}.${index}`} />
					</>}
				</Field>
			</Fragment>)}
			<input onKeyDown={handleKeyDown} onKeyUp={addChip}></input>
		</>
	}}
	</FieldArray>
}