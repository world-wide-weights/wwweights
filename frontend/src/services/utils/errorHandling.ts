import { AxiosError, isAxiosError } from "axios"
import { toast } from "react-toastify"

/**
 * Handle errors and displays error messages to the user
 * @param error the error from the catch
 * @param customErrorCheck custom API error checks with custom behavior
 * @returns {void}
 */
export const errorHandling = (error: unknown, customErrorCheck = (error: AxiosError): void | true => {}) => {
	// Log error
	console.log(error)

	// Handle unkown erros
	if (!isAxiosError(error)) {
		toast.error("Please try again in a few minutes.")
		return
	}

	// Handle errors from API (with api answer)
	if (error.response) {
		if (customErrorCheck(error)) return
		toast.error(error.response.data.message)
		return
	}

	// Handle errors with no answer from API
	if (error.message.includes("Network")) {
		toast.error("We could not connect to the server. Please check your internet connection and try again.")
		return
	}
}
