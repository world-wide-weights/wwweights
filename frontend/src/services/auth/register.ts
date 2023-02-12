import { isAxiosError } from "axios"
import { ApiAuthException } from "../../types/auth"
import { authRequest } from "../axios/axios"

export const register = async ({ username, email, password }: { username: string, email: string, password: string }) => {
    try {
        const response = await authRequest.post<any>("/auth/register", {
            username,
            email,
            password,
        })
        const tokens = response.data

        return tokens
    } catch (error) {
        if (isAxiosError<ApiAuthException & { error: string }>(error) && error.response) {
            return error.response.data
        }
        return null
    }
}