import Image from "next/image"
import { useRef, useState } from "react"

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

    return (
        <div className="relative h-60 bg-blue-500" onDragEnter={handleDrag}>
            <input className="hidden" id="input-file-upload" ref={inputRef} type="file" onChange={handleChange} />
            <label className={`flex items-center justify-center h-full ${dragActive ? "text-white" : ""}`} htmlFor="input-file-upload">
                <div>
                    <p>Drag and drop your file here or</p>
                    <button onClick={() => inputRef.current?.click()} className="upload-button">Upload a file</button>
                </div>
            </label>
            {dragActive && <div className="absolute w-full h-full inset-0" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}></div>}
            {image && <Image src={image as string} alt="uploaded" />}
        </div>
    )
}