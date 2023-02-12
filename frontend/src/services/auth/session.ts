import { SessionData, Tokens } from "../../types/auth"
import { authRequest } from "../axios/axios"
import { parseJwt } from "../utils/jwt"

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