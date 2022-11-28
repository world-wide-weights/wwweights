import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import logo from '../../public/logo.png'
import { Button } from '../Button/Button'
import { IconButton } from '../Button/IconButton'
import { routes } from '../routes'

// TODO: Adjust with routes.ts
const navLinks = [{
    to: routes.weights,
    text: "Discover",
}]

/** Navbar component, should only be used once at the top */
export const Navbar: React.FC = () => {
    const [isNavMobileOpen, setIsNavMobileOpen] = useState<boolean>(false)

    return <div className="bg-white py-3 mb-5">
        <nav className="container md:flex justify-between">
            <div className="flex items-center justify-between">
                <Link className="flex items-center" href={routes.home}>
                    <Image src={logo} alt="Logo" className="min-w-[25px] w-[25px] mr-2" />
                    <h6 className="font-semibold text-lg text-blue-500">World Wide Weights</h6>
                </Link>
                <IconButton className="block md:hidden" onClick={() => setIsNavMobileOpen(isNavMobileOpen => !isNavMobileOpen)} icon="menu" />
            </div>
            <ul className={`${isNavMobileOpen ? "block" : "hidden"} md:flex items-center gap-4 py-5 md:py-0`}>
                {navLinks.map(navLink => <li key={navLink.text} className="mb-4 md:mb-0"><Button to={navLink.to.list} kind="tertiary">{navLink.text}</Button></li>)}
                {/* TODO (Zoe-Bot): Here is a dropdown in the future */}
                <li className="hidden md:inline"><IconButton onClick={() => ""} icon="more_horiz" /></li>
                <li><Button to="/contribute">Contribute</Button></li>
            </ul>
        </nav>
    </div>
}