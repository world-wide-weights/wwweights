import { string } from "yup"

export const getImageUrl = (image: string | undefined) => {
    if (!image) return undefined
    try {
        // Validate if image is URL and throw error if not
        string().url().validateSync(image)
        return image
    } catch (error) {
        return `${process.env.NEXT_PUBLIC_API_BASE_URL_IMAGE}/serve/${image}`
    }
}