import { NextAuthOptions, Session, User } from "next-auth"
import { JWT } from "next-auth/jwt"
import NextAuth from "next-auth/next"
import CredentialsProvider from "next-auth/providers/credentials"
import { authRequest } from "../../../services/axios/axios"
import { parseJwt } from "../../../services/utils/jwt"

export type UserInfo = {
    id: number
    email: string
    username: string
    status: string
    role: string
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "DefaultEmailPassword",
            type: "credentials",
            credentials: {
                email: {
                    label: "email",
                    type: "email",
                },
                password: {
                    label: "Password",
                    type: "password"
                },
            },
            authorize: async (credentials, req) => {
                console.log({
                    id: "nextauth authorize",
                    data: {
                        credentials, req
                    },
                })
                // Login to our api
                const response = await authRequest.post<User>("/auth/login", {
                    email: credentials!.email,
                    password: credentials!.password
                })
                const user = response.data

                // If no error and we have user data, return it
                if (response.status === 200 && user) {
                    return user
                }

                // Some error occured
                return null
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        jwt: async ({ token, user }: { token: JWT, user?: User }) => {
            console.log({
                id: "nextauth jwt",
                data: {
                    token, user
                },
            })
            if (user) {
                // Parse jwt to get payload
                const parsedToken = parseJwt(user.access_token)
                let refreshedTokens

                // Refresh token when expired
                if (Date.now() >= parsedToken.exp * 1000) {
                    console.log("refreshing token")
                    refreshedTokens = await refreshAccessToken(user.access_token)
                }

                // Add access token and user information to the token
                token.accessToken = refreshedTokens?.accessToken ?? user.access_token
                token.user = parsedToken
            }

            // This will be forwarded to the session callback
            return token
        },
        session: async ({ session, token }: { session: Session, token: JWT }) => {
            console.log({
                id: "nextauth session",
                data: {
                    session, token
                },
            })
            const { iat, exp, ...user } = token.user

            // Add access token, refresh token and user to session
            session.accessToken = token.accessToken
            session.user = user
            session.error = token.error

            // Send properties to the client
            return session
        },
    },
    pages: {
        signIn: "/account/login",
    },
}

/**
* Takes a token, and returns a new token with updated `accessToken` and `accessTokenExpires`. If an error occurs, returns the old token and an error property
* @param token The token which we want to refresh.
*/
async function refreshAccessToken(token: string) {
    try {
        const refreshedTokens = await authRequest.post<{ access_token: string, refresh_token: string }>("/refresh", {}, {
            headers: {
                Authorization: "Bearer " + token
            }
        })

        if (!(refreshedTokens.status === 200)) {
            throw refreshedTokens
        }

        return {
            accessToken: refreshedTokens.data.access_token,
            refreshToken: refreshedTokens.data.refresh_token ?? token, // Fall back to old refresh token
        }
    } catch (error) {
        console.log(error)

        return {
            refreshToken: token,
            error: "RefreshAccessTokenError",
        }
    }
}

export default NextAuth(authOptions)
