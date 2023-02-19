import { HttpStatusCode } from "axios"

export type Tokens = {
	access_token: string
	refresh_token: string
}

export type ApiAuthException = {
	statusCode: HttpStatusCode
	message: string
}

export type SessionData = {
	accessToken: string
	decodedAccessToken: {
		username: string
		id: number
		email: string
		status: string
		role: string
		iat: number
		exp: number
	}
	refreshToken: string
}

export type UserProfile = {
	pkUserId: number
	username: string
	email: string
	status: "unverified" | "verified" | "BANNED"
	role: "admin" | "user" | "moderator"
	lastLogin: Date | null
	createdAt: Date
}
