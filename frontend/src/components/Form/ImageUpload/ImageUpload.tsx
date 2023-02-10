import { Field, FieldProps } from "formik"
import Image from "next/image"
import { useRef, useState } from "react"
import { IconButton } from "../../Button/IconButton"
import { Icon } from "../../Icon/Icon"

type ImageUploadProps = {
    /** The name of the field. */
    name: string
}

/**
 * A drag and drop image upload component.
 */
export const ImageUpload: React.FC<ImageUploadProps> = ({ name }) => {
    // Local States
    const [image, setImage] = useState<string | ArrayBuffer | null>(null)
    const [dragActive, setDragActive] = useState(false)

    // Refs
    const inputRef = useRef<HTMLInputElement>(null)

    /**
     * Handles the image.
     * @param files The files that were uploaded.
     */
    const handleImage = (files: FileList, formikProps: FieldProps<any>) => {
        const file = files[0]
        if (!file) {
            return
        }

        // File size bigger than 5MB
        if (file.size > 5e+6) {
            console.error("File size is too big.")
            return
        }

        // File type not image (svg, png, jpeg, jpg)
        if (file.type !== "image/svg" && file.type !== "image/png" && file.type !== "image/jpeg" && file.type !== "image/jpg") {
            console.error("File type is not supported.")
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
     */
    const handleDrag = function (event: React.DragEvent<HTMLDivElement>) {
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
     */
    const handleDrop = function (event: React.DragEvent<HTMLDivElement>, formikProps: FieldProps<any>) {
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
     */
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>, formikProps: FieldProps<any>) => {
        event.preventDefault()
        event.stopPropagation()

        if (event.target.files && event.target.files[0]) {
            handleImage(event.target.files, formikProps)
        }
    }

    return <Field name={name}>{(props: FieldProps<any>) => <>
        <div className={`relative transition duration-200 w-full h-56 ${dragActive ? "border-2 border-blue-500 border-dashed" : `${image ? "" : "border-2 border-gray-300 border-dashed"}`}`} onDragEnter={handleDrag}>
            {/* Upload Drag and Dropbox */}
            {!image && <>
                {/* File upload */}
                <input className="hidden" id="input-file-upload" ref={inputRef} type="file" accept=".svg,.png,.jpg,.jpeg" onChange={(event) => handleChange(event, props)} />

                {/* File upload content */}
                <label className="flex items-center text-gray-500 h-full" htmlFor="input-file-upload">
                    <Icon className={`text-5xl ${dragActive ? "text-blue-500" : ""} mx-5`}>image</Icon>
                    <div>
                        <span className="font-medium text-gray-700 mr-1">Drag your Image or</span>
                        {/* Browse button */}
                        <button type="button" onClick={() => inputRef.current?.click()} className="inline font-medium text-blue-500 hover:text-blue-700">Browse</button>
                        <p className="text-gray-500 text-sm">SVG, PNG, JPG or JPEG (max file size: 5MB)</p>
                    </div>
                </label>

                {/* Drag Box */}
                {dragActive && <div className="absolute inset-0 w-full h-full" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={(event) => handleDrop(event, props)}></div>}
            </>}

            {/* Image Preview */}
            {image && <div className="relative sm:w-max">
                <IconButton className="absolute top-0 right-0 bg-white mr-1 mt-1" icon="delete" onClick={() => {
                    setImage(null)
                    props.form.setFieldValue(props.field.name, null)
                }}></IconButton>
                <Image className="w-full sm:w-auto object-cover h-56" src={image as string} width={200} height={200} alt="uploaded" />
            </div>}
        </div>
    </>}
    </Field>
}