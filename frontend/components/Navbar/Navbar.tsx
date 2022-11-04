import Image from 'next/image'
import logo from '../../public/logo.png'

/** Navbar component, should only be used once at the top */
export const Navbar: React.FC = () => {
    return <div className="bg-gray-100">
        <div className="container flex items-center py-4 mb-5">
            <Image src={logo} alt="Logo" className="min-w-[25px] w-[25px] mr-2" />
            <h6 className="font-semibold">WWWeights</h6>
        </div>
    </div>
}