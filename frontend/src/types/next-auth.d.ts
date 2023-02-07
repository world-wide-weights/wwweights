import "next-auth"
import { UserInfo } from "../pages/api/auth/[...nextauth]"

/**
 * Overrides the next auth type definitions
 */
declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: UserInfo
        error?: string
        accessToken: string
        expires: Date
    }
    // Auth Response
    interface User {
        access_token: string
        refresh_token: string
    }

    interface Account { }

    interface Profile { }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken: string
        refreshToken: string
        user: {
            username: string
            id: number
            email: string
            status: string
            role: string
            iat: number
            exp: number
        }
        error?: string
    }
}