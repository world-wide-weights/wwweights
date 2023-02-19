import { AxiosError, isAxiosError } from "axios"
import { toast } from "react-toastify"

export const errorHandling = (error: unknown, customErrorCheck = (error: AxiosError): void | true => { }) => {
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