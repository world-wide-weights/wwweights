import { string } from "yup"

/**
 * Generate image url with image string.
 * @param image the image string
 * @returns the image url
 */
export const getImageUrl = (image: string | undefined): string | undefined => {
	if (!image) return undefined
	try {
		// Validate if image is URL and throw error if not
		string().url().validateSync(image)
		return image
	} catch (error) {
		return `${process.env.NEXT_PUBLIC_API_BASE_URL_IMAGE_CLIENT}/serve/${image}`
	}
}
