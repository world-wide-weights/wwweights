import { signOut, useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { useState } from "react"
import logo from "../../../public/logo.png"
import { routes } from "../../services/routes/routes"
import { Button } from "../Button/Button"
import { IconButton } from "../Button/IconButton"

type NavLink = {
    shouldDisplay: boolean
    text: string
} & ({
    to: string
} | {
    onClick: () => void
})

/** 
 * Navbar component, should only be used once at the top 
 */
export const Navbar: React.FC = () => {
    const { data: session } = useSession()
    const [isNavMobileOpen, setIsNavMobileOpen] = useState<boolean>(false)
    const router = useRouter()

    const navLinks: NavLink[] = [{
        shouldDisplay: true,
        to: routes.weights.list(),
        text: "Discover",
    }, {
        shouldDisplay: Boolean(session),
        to: routes.account.profile(),
        text: "My Profile",
    }, {
        shouldDisplay: Boolean(!session),
        to: routes.account.login + "?callbackUrl=" + router.asPath,
        text: "Login",
    }, {
        shouldDisplay: Boolean(!session),
        to: routes.account.register + "?callbackUrl=" + router.asPath,
        text: "Register",
    }, {
        shouldDisplay: Boolean(session),
        onClick: () => signOut(),
        text: "Logout"
    }]

    return <div className="bg-white py-3">
        <nav className="container md:flex justify-between">
            <div className="flex items-center justify-between">
                <Link className="flex items-center" href={routes.home}>
                    <Image src={logo} alt="Logo" className="min-w-[25px] w-[25px] mr-2" />
                    <h6 className="font-bold text-lg text-blue-500">World Wide Weights</h6>
                </Link>
                <IconButton className="block md:hidden" onClick={() => setIsNavMobileOpen(isNavMobileOpen => !isNavMobileOpen)} icon="menu" />
            </div>
            <ul className={`${isNavMobileOpen ? "block" : "hidden"} md:flex items-center gap-4 py-5 md:py-0`}>
                {/* TODO (Zoe-Bot): Find better solution if active state is onclick */}
                {/* When viewCondition is set then show based on it, when not then just show */}
                {navLinks.map(navLink => (navLink.shouldDisplay) && <li key={navLink.text} className="mb-4 md:mb-0"><Button {...navLink} isColored={"to" in navLink && (navLink.to === router.pathname)} disabled={"to" in navLink && (navLink.to === router.pathname)} dimOpacityWhenDisabled={false} kind="tertiary">{navLink.text}</Button></li>)}
                {/* TODO (Zoe-Bot): Here is a dropdown in the future */}
                {/* <li className="hidden md:inline"><IconButton onClick={() => ""} icon="more_horiz" /></li> */}
                {/* TODO (Zoe-Bot): Add correct link when contribute exist */}
                <li><Button to={routes.contribute.create}>Contribute</Button></li>
            </ul >
        </nav >
    </div >
}