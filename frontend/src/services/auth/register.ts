import { isAxiosError } from "axios"
import { ApiAuthException, SessionData, Tokens } from "../../types/auth"
import { authRequest } from "../axios/axios"
import { createSession, saveSession } from "./session"

/**
 * Register a new user and return the tokens.
 * @param credentials credentials from user
 * @returns session, error or null if request failed.
 */
export const register = async ({
	username,
	email,
	password,
}: {
	username: string
	email: string
	password: string
}): Promise<SessionData | (ApiAuthException & { error: string }) | null> => {
	try {
		const response = await authRequest.post<Tokens>("/auth/register", {
			username,
			email,
			password,
		})
		const tokens = response.data

		// Create session and save it to local storage from tokens
		const session = createSession(tokens)
		saveSession(session)

		return session
	} catch (error) {
		if (isAxiosError<ApiAuthException & { error: string }>(error) && error.response) {
			return error.response.data
		}
		return null
	}
}
