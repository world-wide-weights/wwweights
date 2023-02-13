import { useRouter } from "next/router"
import { createContext, useCallback, useEffect, useState } from "react"
import { endSession, getSessionData } from "../../services/auth/session"
import { routes } from "../../services/routes/routes"
import { SessionData } from "../../types/auth"

type AuthProps = {
    /** The page content shown when user logged in. */
    children: React.ReactNode
    /** When route is protected need to be logged in. When its guest you need to be logged out. */
    routeType: "protected" | "guest" | "public"
}

export const AuthContext = createContext({
    hasSession: false,
    logout: () => { },
    getSession: () => new Promise<SessionData | null>(() => { }),
    isLoading: true
})

/**
 * Auth wrapper. Using this wrapper already in _app.tsx. So you don't need to manually wrap this around page.
 * When you want to have authenticated page add xxx.auth = { routeType: "protected" } to the page.
 * Checks if a user is logged in or not, handle guest routes and handle login redirect or render page.
 */
export const Auth: React.FC<AuthProps> = ({ children, routeType }) => {
    const [hasSession, setHasSession] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const router = useRouter()

    const logout = useCallback(() => {
        endSession()
        setHasSession(false)
    }, [])

    const getSession = useCallback(async (): Promise<SessionData | null> => {
        const session = getSessionData()

        if (session === null) {
            logout()
            return null
        }

        return session
    }, [logout])

    useEffect(() => {
        const checkSession = async () => {
            const sessionData = await getSession()
            const hasSessionData = Boolean(sessionData)
            setHasSession(hasSessionData)
            setIsLoading(false)

            // When no user redirect to login, isRouterChanging prevents push new route when router already pushing
            if (!hasSessionData && routeType === "protected") {
                router.push(routes.account.login + "?callbackUrl=" + router.asPath)
            }

            // When user and route type guest redirect to home, isRouterChanging prevents push new route when router already pushing
            if (hasSessionData && routeType === "guest") {
                router.push(routes.home)
            }
        }
        checkSession()
    }, [routeType, router, hasSession, getSession])

    return <AuthContext.Provider value={{ hasSession, logout, isLoading, getSession }}>
        {children}
    </AuthContext.Provider>
}