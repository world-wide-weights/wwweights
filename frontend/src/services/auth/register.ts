import { isAxiosError } from "axios"
import { ApiAuthException, Tokens } from "../../types/auth"
import { authRequest } from "../axios/axios"

/**
 * Register a new user and return the tokens.
 * @param credentials credentials from user
 * @returns tokens, error or null if request failed.
 */
export const register = async ({ username, email, password }: { username: string, email: string, password: string }): Promise<Tokens | ApiAuthException & { error: string } | null> => {
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