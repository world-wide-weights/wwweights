import { isAxiosError } from "axios"
import { ApiAuthException, SessionData, Tokens } from "../../types/auth"
import { authClientRequest } from "../axios/axios"
import { createSession, saveSession } from "./session"

/**
 * Login a user and return the tokens.
 * @param credentials credentials from user
 * @returns session, error or null if request failed.
 */
export const login = async ({ email, password }: { email: string; password: string }): Promise<SessionData | ApiAuthException | null> => {
	try {
		const response = await authClientRequest.post<Tokens>("/auth/login", {
			email,
			password,
		})
		const tokens = response.data

		// Create session and save it to local storage from tokens
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
