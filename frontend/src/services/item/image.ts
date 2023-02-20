import { AxiosResponse } from "axios"
import { SessionData } from "../../types/auth"
import { ImageUploadResponse } from "../../types/image"
import { imageRequest } from "../axios/axios"

/**
 * Upload an image to the api
 * @param imageFile the image to upload
 * @param session the current session
 * @returns response from api
 */
export const uploadImageApi = async (imageFile: File, session: SessionData): Promise<AxiosResponse<ImageUploadResponse>> => {
	// Create form and append image
	const formData = new FormData()
	formData.append("image", imageFile)

	// Upload image
	const imageResponse = await imageRequest.post<ImageUploadResponse>("/upload/image", formData, {
		headers: {
			Authorization: `Bearer ${session.accessToken}`,
			"Content-Type": "multipart/form-data",
		},
		validateStatus(status) {
			// Accept 409 Conflict as valid status
			return (status >= 200 && status < 300) || status === 409
		},
	})

	return imageResponse
}
