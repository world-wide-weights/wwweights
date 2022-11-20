import Image from 'next/image'
import Link from 'next/link'
import { routes } from '../../pages/routes'
import logo from '../../public/logo.png'

/** Navbar component, should only be used once at the top */
export const Navbar: React.FC = () => {
    return <div className="bg-gray-100 mb-5">
        <div className="container">
            <Link className="flex items-center py-4" href={routes.home}>
                <Image src={logo} alt="Logo" className="min-w-[25px] w-[25px] mr-2" />
                <h6 className="font-semibold">World Wide Weights</h6>
            </Link>
        </div>
    </div>
}