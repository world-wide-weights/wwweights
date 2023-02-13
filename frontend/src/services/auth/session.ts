import { SessionData, Tokens } from "../../types/auth"
import { authRequest } from "../axios/axios"
import { parseJwt } from "../utils/jwt"

const LOCAL_STORAGE_KEY = "session"

/**
 * Create a session object from the tokens.
 * @param tokens access and refresh tokens
 * @returns session object
 */
export const createSession = (tokens: Tokens): SessionData => {
    const { access_token, refresh_token } = tokens

    // Decode access token
    const decodedAccessToken = parseJwt(access_token)

    // Create session object
    const sessionData: SessionData = {
        accessToken: access_token,
        refreshToken: refresh_token,
        decodedAccessToken,
    }

    return sessionData
}

/**
 * Save session data in local storage.
 * @param sessionData session data to save in local storage
 */
export const saveSession = (sessionData: SessionData): void => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sessionData))
}

/** 
 * Get session data from local storage and update the access token if it has expired.
 * @returns session data or null if no session data is found
 */
export const getSessionData = async (): Promise<SessionData | null> => {
    // Get session from local storage
    const sessionData = localStorage.getItem(LOCAL_STORAGE_KEY)

    if (sessionData) {
        const parsedSessionData: SessionData = JSON.parse(sessionData)

        // Update token if expired
        if (Date.now() > parsedSessionData.decodedAccessToken.exp * 1000) {
            console.log("Session expired, refreshing token")
            const tokens = await refreshToken(parsedSessionData.refreshToken)

            // Refresh token failed
            if (tokens === null) {
                console.error("Session expired and refresh token failed")
                return null
            }

            // Update session when refresh token succeeded
            const newSession = createSession(tokens)
            saveSession(newSession)
            console.log("Session refreshed")

            return newSession
        }

        // Token is still valid
        return parsedSessionData
    }

    // No session data found
    return null
}

/**
 * Remove session data from local storage.
 */
export const endSession = (): void => {
    localStorage.removeItem(LOCAL_STORAGE_KEY)
}

/**
 * Refresh the access token using the refresh token.
 * @param refreshToken refresh token
 * @returns new access and refresh tokens
 */
export const refreshToken = async (refreshToken: string): Promise<Tokens | null> => {
    try {
        const response = await authRequest.post<Tokens>("/auth/refresh", {}, {
            headers: {
                Authorization: "Bearer " + refreshToken
            }
        })

        const tokens = response.data
        return tokens
    } catch (error) {
        return null
    }
}