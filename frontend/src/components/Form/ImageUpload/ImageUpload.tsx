import { Field, FieldProps } from "formik"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { getImageUrl } from "../../../services/utils/getImageUrl"
import { IconButton } from "../../Button/IconButton"
import { FormError } from "../../Errors/FormError"
import { Icon } from "../../Icon/Icon"

type ImageUploadProps = {
	/** The name of the field. */
	name: string
	/** The path of the image. Use to set an image for an edit view. */
	filePath?: string
}

/**
 * A drag and drop image upload component.
 * @example <ImageUpload name="image" />
 */
export const ImageUpload: React.FC<ImageUploadProps> = ({ name, filePath }) => {
	// Local States
	const [image, setImage] = useState<string | ArrayBuffer | null>(null)
	const [dragActive, setDragActive] = useState(false)

	// Refs
	const inputRef = useRef<HTMLInputElement>(null)

	// Set initial image
	useEffect(() => {
		if (!filePath) return

		const image = getImageUrl(filePath)! // It will always return an string, because filePath is set.
		setImage(image)
	}, [filePath])

	/**
	 * Handles the image.
	 * @param files The files that were uploaded.
	 * @param formikProps helper
	 */
	const handleImage = (files: FileList, formikProps: FieldProps<any>) => {
		formikProps.form.setFieldTouched(name, true, false)
		const file = files[0]
		if (!file) {
			return
		}

		// File size bigger than 2MB
		if (file.size > 2e6) {
			formikProps.form.setFieldError(name, "File size is too big.")
			return
		}

		// File type not image (png, jpeg, jpg)
		if (file.type !== "image/png" && file.type !== "image/jpeg" && file.type !== "image/jpg") {
			formikProps.form.setFieldError(name, "File type is not supported.")
			return
		}

		const reader = new FileReader()
		reader.readAsDataURL(file)
		reader.onloadend = () => {
			setImage(reader.result)
			formikProps.form.setFieldValue(formikProps.field.name, file)
		}
	}

	/**
	 * Handles the drag event to set drag state correct.
	 * @param event The drag event.
	 * @param formikProps helper
	 */
	const handleDrag = (event: React.DragEvent<HTMLDivElement>) => {
		// If image is already set, do nothing.
		if (image) return

		event.preventDefault()
		event.stopPropagation()

		if (event.type === "dragenter" || event.type === "dragover") {
			setDragActive(true)
		} else if (event.type === "dragleave") {
			setDragActive(false)
		}
	}

	/**
	 * Handles image when got inserted by drag an drop.
	 * @param event The drop event.
	 * @param formikProps helper
	 */
	const handleDrop = (event: React.DragEvent<HTMLDivElement>, formikProps: FieldProps<any>) => {
		event.preventDefault()
		event.stopPropagation()
		setDragActive(false)

		if (event.dataTransfer.files && event.dataTransfer.files[0]) {
			handleImage(event.dataTransfer.files, formikProps)
		}
	}

	/**
	 * Handles image when inserted via browse button.
	 * @param event The change event.
	 * @param formikProps helper
	 */
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>, formikProps: FieldProps<any>) => {
		event.preventDefault()
		event.stopPropagation()

		if (event.target.files && event.target.files[0]) {
			handleImage(event.target.files, formikProps)
		}
	}

	/**
	 * Clear image from state and formik.
	 * @param formikProps helper
	 */
	const resetImage = (formikProps: FieldProps<any>) => {
		setImage(null)
		formikProps.form.setFieldValue(formikProps.field.name, null)
	}

	return (
		<Field name={name}>
			{(props: FieldProps<any>) => (
				<>
					<div
						className={`mb-2 md:mb-4 relative transition duration-200 w-full h-56 border-2 border-dashed ${
							dragActive ? "border-blue-500" : `${image ? "" : props.meta.error && props.meta.touched ? "border-red-500" : "border-gray-300"}`
						}`}
						onDragEnter={handleDrag}
					>
						{/* Upload Drag and Dropbox */}
						{!image && (
							<>
								{/* File upload */}
								<input
									datacy={`imageupload-${name}-file-input`}
									className="hidden"
									id="input-file-upload"
									ref={inputRef}
									type="file"
									accept=".png,.jpg,.jpeg"
									onChange={(event) => handleChange(event, props)}
								/>

								{/* File upload content */}
								<label datacy={`imageupload-${name}-content`} className="flex items-center text-gray-500 h-full cursor-pointer" htmlFor="input-file-upload">
									<Icon className={`text-5xl ${dragActive ? "text-blue-500" : ""} mx-5`}>image</Icon>
									<div>
										<span className="font-medium text-gray-700 mr-1">Drag your Image or</span>
										{/* Browse button */}
										<button type="button" onClick={() => inputRef.current?.click()} className="inline font-medium text-blue-500 hover:text-blue-700">
											Browse
										</button>
										<p className="text-gray-500 text-sm">PNG, JPG or JPEG (max file size: 2MB)</p>
									</div>
								</label>

								{/* Drag Box */}
								{dragActive && (
									<div
										className="absolute inset-0 w-full h-full"
										onDragEnter={handleDrag}
										onDragLeave={handleDrag}
										onDragOver={handleDrag}
										onDrop={(event) => handleDrop(event, props)}
									></div>
								)}
							</>
						)}

						{/* Image Preview */}
						{image && (
							<div className="relative sm:w-max">
								<IconButton
									datacy={`imageupload-${name}-reset-image`}
									className="absolute top-0 right-0 bg-white mr-1 mt-1"
									icon="delete"
									onClick={() => resetImage(props)}
								></IconButton>
								<Image
									datacy={`imageupload-${name}-image`}
									className="w-full sm:w-auto object-cover h-56"
									src={image as string}
									width={200}
									height={200}
									alt="uploaded"
								/>
							</div>
						)}
					</div>
					{props.meta.error && props.meta.touched && (
						<div className="mb-3">
							<FormError field={name} />
						</div>
					)}
				</>
			)}
		</Field>
	)
}
