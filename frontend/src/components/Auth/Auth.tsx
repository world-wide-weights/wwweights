import { useRouter } from "next/router"
import { createContext, useEffect, useState } from "react"
import { endSession, getSession } from "../../services/auth/session"
import { routes } from "../../services/routes/routes"

type AuthProps = {
    /** The page content shown when user logged in. */
    children: React.ReactNode
    /** When route is protected need to be logged in. When its guest you need to be logged out. */
    routeType: "protected" | "guest" | "public"
}

export const AuthContext = createContext({
    hasSession: false,
    logout: () => { },
    isLoading: true
})

/**
 * Auth wrapper. Using this wrapper already in _app.tsx. So you don't need to manually wrap this around page.
 * When you want to have authenticated page add xxx.auth = { routeType: "protected" } to the page.
 * Checks if a user is logged in or not, handle guest routes and handle login redirect or render page.
 */
export const Auth: React.FC<AuthProps> = ({ children, routeType }) => {
    const [hasSession, setHasSession] = useState<boolean>(true)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const router = useRouter()

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
    }, [routeType, router, hasSession])


    const logout = () => {
        endSession()
        setHasSession(false)
    }
    return <AuthContext.Provider value={{ hasSession, logout, isLoading }}>
        {(
            routeType === "public" ||
            (routeType === "protected" && hasSession) ||
            (routeType === "guest" && !hasSession)) ? children : <div>Loading...</div>}
    </AuthContext.Provider>
}