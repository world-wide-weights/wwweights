import { NextAuthOptions, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import NextAuth from "next-auth/next";
import CredentialsProvider from 'next-auth/providers/credentials';
import { LoginDto } from "../../account/login";

export type UserInfo = {
    email: string
    username: string
    slug: 1 // TODO (Zoe-Bot): Adjust type when correct api implemented
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'DefaultEmailPassword',
            credentials: {
                email: {
                    label: 'email',
                    type: 'email',
                },
                password: {
                    label: 'Password',
                    type: 'password'
                },
            },
            authorize: async (credentials, req) => {
                const payload: LoginDto = {
                    email: credentials!.email,
                    password: credentials!.password,
                }

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/login`, {
                    method: 'POST',
                    body: JSON.stringify(payload),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const user = await response.json();
                if (!response.ok) {
                    throw new Error(user)
                }
                // If no error and we have user data, return it
                if (response.ok && user) {
                    return user
                }

                // Return null if user data could not be retrieved
                return null
            },
        }),
    ],
    callbacks: {
        jwt: async ({ token, user }: { token: JWT, user?: User }) => {
            if (user) {
                return {
                    ...token,
                    accessToken: user.accessToken,
                    user
                }
            }

            return token
        },
        session: async ({ session, token }: { session: Session, token: JWT }) => {
            session.accessToken = token.accessToken
            session.user = token.user.user

            return session
        },
    },
    pages: {
        signIn: '/account/login',
    },
}

export default NextAuth(authOptions)
