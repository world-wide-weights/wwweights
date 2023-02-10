import Image from "next/image"
import { useRef, useState } from "react"
import { IconButton } from "../../Button/IconButton"
import { Icon } from "../../Icon/Icon"

/**
 * A drag and drop image upload component.
 */
export const ImageUpload: React.FC = () => {
    const [image, setImage] = useState<string | ArrayBuffer | null>("")
    const [dragActive, setDragActive] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    /**
     * Handles the image change event.
     * @param files The files that were uploaded.
     */
    const handleImageChange = (files: FileList) => {
        console.log(files)

        const file = files[0]
        if (!file) {
            return
        }

        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = () => {
            setImage(reader.result)
        }
    }

    /**
     * Handles the drag event.
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
     * Handles the drop event.
    * @param event The drop event.
    */
    const handleDrop = function (event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault()
        event.stopPropagation()
        setDragActive(false)

        if (event.dataTransfer.files && event.dataTransfer.files[0]) {
            handleImageChange(event.dataTransfer.files)
        }
    }

    /**
     * Handles the change event.
     * @param event The change event.
     */
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault()
        event.stopPropagation()

        if (event.target.files && event.target.files[0]) {
            handleImageChange(event.target.files)
        }
    }

    return <>
        <div className={`relative transition duration-200 ${dragActive ? "border-2 border-blue-500 border-dashed" : `${image ? "" : "border-2 border-gray-300 border-dashed"}`} h-36`} onDragEnter={handleDrag}>
            {/* Upload Drag and Dropbox */}
            {!image && <>
                {/* File upload */}
                <input className="hidden" id="input-file-upload" ref={inputRef} type="file" onChange={handleChange} />

                {/* File upload content */}
                <label className="flex items-center text-gray-500 h-full" htmlFor="input-file-upload">
                    <Icon className={`text-5xl ${dragActive ? "text-blue-500" : ""} mx-5`}>image</Icon>
                    <div>
                        <span className="font-medium text-gray-700 mr-1">Drag your Image or</span>
                        {/* Browse button */}
                        <button onClick={() => inputRef.current?.click()} className="inline font-medium text-blue-500 hover:text-blue-700">Browse</button>
                        <p className="text-gray-500 text-sm">SVG, PNG or JPG (max file size: 20MB)</p>
                    </div>
                </label>

                {/* Drag Box */}
                {dragActive && <div className="absolute w-full h-full inset-0" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}></div>}
            </>}

            {/* Image Preview */}
            {image && <div className="relative w-max">
                <IconButton className="absolute top-0 right-0 bg-white mr-1 mt-1" icon="delete" onClick={() => setImage(null)}></IconButton>
                <Image className="w-auto h-36" src={image as string} width={200} height={200} alt="uploaded" />
            </div>}
        </div>
    </>
}