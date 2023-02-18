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

type AuthContext = {
    /** Check if user has session. */
    hasSession: boolean
    /** Check if auth context is loading. */
    isLoading: boolean
    /** Logout user and remove session data from localstorage. */
    logout: () => void
    /** Get session data from localstorage and logout when refresh token fails. */
    getSession: () => Promise<SessionData | null>
}

/**
 * Creates global context for auth. This context is wrapped around all pages.
 */
export const AuthContext = createContext<AuthContext>({
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
    const { replace, isReady, asPath } = useRouter()

    /**
     * Logout user and remove session data from localstorage.
     */
    const logout = useCallback(() => {
        endSession()
        setHasSession(false)
    }, [])

    /**
     * Get session data from localstorage and logout when session is expired.
     */
    const getSession = useCallback(async (): Promise<SessionData | null> => {
        const session = await getSessionData()

        if (session === null) {
            logout()
            return null
        }

        return session
    }, [logout])

    /**
     * Handle redirects and updates the auth context.
     */
    useEffect(() => {
        const checkSession = async () => {
            const sessionData = await getSession()
            const hasSessionData = Boolean(sessionData)
            setHasSession(hasSessionData)
            setIsLoading(false)

            // When no session redirect (with no history) to login
            if (!hasSessionData && routeType === "protected") {
                if (!isReady)
                    return
                replace(routes.account.login + "?callbackUrl=" + asPath)
            }

            // When has session and route type guest redirect (with no history) to home
            if (hasSessionData && routeType === "guest") {
                replace(routes.home)
            }
        }
        checkSession()
    }, [routeType, isReady, hasSession, asPath, getSession, replace])

    return <AuthContext.Provider value={{ hasSession, logout, isLoading, getSession }}>
        {children}
    </AuthContext.Provider>
}