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
        accessToken: string
        expires: Date
    }

    // Auth Response
    interface User {
        accessToken: string,
        user: UserInfo
    }

    interface Account { }

    interface Profile { }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken: string
        user: {
            accessToken: string
            user: UserInfo
        },
        iat: number,
        exp: number,
        jti: string
    }
}