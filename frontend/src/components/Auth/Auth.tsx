import { signIn, useSession } from "next-auth/react"
import { useEffect } from "react"

type AuthProps = {
    /** The page content shown when user logged in. */
    children: React.ReactNode
}

/**
 * Auth wrapper. Using this wrapper already in _app.tsx. So you don't need to manually wrap this around page.
 * When you want to have authenticated page add xxx.auth = true to the page.
 * Checks if a user is logged in or not and handle login redirect or render page.
 */
export const Auth: React.FC<AuthProps> = ({ children }) => {
    const { data: session, status } = useSession()
    const isUser = !!session?.user

    useEffect(() => {
        if (status === "loading")
            return

        // When no user redirect to login
        if (!isUser)
            signIn()
    }, [isUser, status])

    // Render page when user
    if (isUser) {
        return <>
            {children}
        </>
    }

    // Session is being fetched, or no user.
    // If no user, useEffect() will redirect.
    // TODO (Zoe-Bot): Implement Loading State
    return <div>Loading...</div>
}