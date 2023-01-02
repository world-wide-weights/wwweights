import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { routes } from "../../services/routes/routes"

type AuthProps = {
    /** The page content shown when user logged in. */
    children: React.ReactNode
    /** When route is protected need to be logged in. When its guest you need to be logged out. */
    routeType: "protected" | "guest"
}

/**
 * Auth wrapper. Using this wrapper already in _app.tsx. So you don't need to manually wrap this around page.
 * When you want to have authenticated page add xxx.auth = { routeType: "protected" } to the page.
 * Checks if a user is logged in or not, handle guest routes and handle login redirect or render page.
 */
export const Auth: React.FC<AuthProps> = ({ children, routeType }) => {
    const { data: session, status } = useSession()
    const router = useRouter()
    const isUser = !!session?.user

    useEffect(() => {
        if (status === "loading")
            return

        // When no user redirect to login
        if (!isUser && routeType === "protected")
            signIn()

        // When user and route type guest redirect to home
        if (isUser && routeType === "guest")
            router.push(routes.home)
    }, [isUser, status])

    // Render page when user or route type guest
    if (isUser || routeType === "guest")
        return <>
            {children}
        </>

    // Session is being fetched, or no user.
    // If no user, useEffect() will redirect.
    // TODO (Zoe-Bot): Implement Loading State
    return <div>Loading...</div>
}