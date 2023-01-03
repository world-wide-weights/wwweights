import { signIn, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import logo from '../../../public/logo.png'
import { routes } from '../../services/routes/routes'
import { Button } from '../Button/Button'
import { IconButton } from '../Button/IconButton'

/** 
 * Navbar component, should only be used once at the top 
 */
export const Navbar: React.FC = () => {
    const { data: session } = useSession()
    const [isNavMobileOpen, setIsNavMobileOpen] = useState<boolean>(false)
    const router = useRouter()

    const navLinks = [{
        to: routes.weights.list(),
        text: "Discover",
    }, {
        viewCondition: session,
        to: routes.account.profile(),
        text: "My Profile",
    }, {
        viewCondition: !session,
        onClick: () => signIn(),
        text: "Login",
    }, {
        viewCondition: !session,
        to: routes.account.register + "?callbackUrl=" + router.pathname,
        text: "Register",
    }, {
        viewCondition: session,
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
                {/* When viewCondition is set then show based on it, when not then just show */}
                {navLinks.map(navLink => (navLink.viewCondition === undefined ? true : navLink.viewCondition) && <li key={navLink.text} className="mb-4 md:mb-0"><Button {...navLink} kind="tertiary">{navLink.text}</Button></li>)}
                {/* TODO (Zoe-Bot): Here is a dropdown in the future */}
                {/* <li className="hidden md:inline"><IconButton onClick={() => ""} icon="more_horiz" /></li> */}
                {/* TODO (Zoe-Bot): Add correct link when contribute exist */}
                <li><Button to={routes.account.login}>Contribute</Button></li>
            </ul>
        </nav>
    </div>
}