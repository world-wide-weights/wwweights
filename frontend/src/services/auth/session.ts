import { SessionData, Tokens } from "../../types/auth"
import { authRequest } from "../axios/axios"
import { parseJwt } from "../utils/jwt"

const LOCAL_STORAGE_KEY = "session"

export const createSession = (tokens: Tokens) => {
    const { access_token, refresh_token } = tokens

    const decodedAccessToken = parseJwt(access_token)

    const sessionData: SessionData = {
        accessToken: access_token,
        refreshToken: refresh_token,
        decodedAccessToken,
    }

    return sessionData
}

export const saveSession = (sessionData: SessionData): void => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sessionData))
}

export const getSession = async (): Promise<SessionData | null> => {
    const sessionData = localStorage.getItem(LOCAL_STORAGE_KEY)

    if (sessionData) {
        const parsedSessionData: SessionData = JSON.parse(sessionData)
        if (Date.now() > parsedSessionData.decodedAccessToken.exp * 1000) {
            console.log("Session expired, refreshing token")
            const tokens = await refreshToken(parsedSessionData.refreshToken)
            if (tokens === null) {
                endSession()
                console.error("Session expired and refresh token failed")
                return null
            }
            const newSession = createSession(tokens)
            saveSession(newSession)
            console.log("Session refreshed")
            return newSession
        }
        return parsedSessionData
    }
    return null
}

export const endSession = (): void => {
    localStorage.removeItem(LOCAL_STORAGE_KEY)
}

// Test this snippet
export const refreshToken = async (refreshToken: string) => {
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