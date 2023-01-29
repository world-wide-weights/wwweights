import { NextAuthOptions, Session, User } from "next-auth"
import { JWT } from "next-auth/jwt"
import NextAuth from "next-auth/next"
import CredentialsProvider from "next-auth/providers/credentials"
import { authRequest } from "../../../services/axios/axios"

export type UserInfo = {
    email: string
    username: string
    slug: 1 // TODO (Zoe-Bot): Adjust type when correct api implemented
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "DefaultEmailPassword",
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
            authorize: async (credentials) => {
                // TODO (Zoe-Bot): Maybe add csrf token?
                // Login to our api
                const response = await authRequest.post<User>("/login", {
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
            if (user) {
                // Add accessToken and user information to the token
                token.accessToken = user.accessToken
                token.user = user
            }

            // This will be forwarded to the session callback
            return token
        },
        session: async ({ session, token }: { session: Session, token: JWT }) => {
            // Add accessToken and user to session
            session.accessToken = token.accessToken
            session.user = token.user.user

            // Send properties to the client
            return session
        },
    },
    pages: {
        signIn: "/account/login",
    },
}

export default NextAuth(authOptions)
