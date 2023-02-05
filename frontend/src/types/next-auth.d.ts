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
        refreshToken: string
        accessToken: string
        expires: Date
    }

    // Auth Response
    interface User {
        access_token: string
        refresh_token: string
        user: UserInfo
    }

    interface Account { }

    interface Profile { }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken: string
        refreshToken: string
        user: {
            refresh_token: string
            access_token: string
            user: UserInfo
        },
        iat: number,
        exp: number,
        jti: string
    }
}