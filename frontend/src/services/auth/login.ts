import { isAxiosError } from "axios"
import { ApiAuthException, Tokens } from "../../types/auth"
import { authRequest } from "../axios/axios"
import { createSession } from "./session"
import { saveSession } from "./storage"

export const login = async ({ email, password }: { email: string, password: string }) => {
    try {
        const response = await authRequest.post<Tokens>("/auth/login", {
            email,
            password,
        })
        const tokens = response.data

        const session = createSession(tokens)
        saveSession(session)

        return session
    } catch (error) {
        if (isAxiosError<ApiAuthException>(error) && error.response) {
            return error.response.data
        }
        return null
    }
}