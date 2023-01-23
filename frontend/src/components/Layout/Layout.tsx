import { Footer } from "../Footer/Footer"
import { Navbar } from "../Navbar/Navbar"

type LayoutProps = {
    /** The main content. */
    children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return <>
        <div className="min-h-screen flex flex-col bg-gray-100 md:border-t-4 md:border-blue-500">
            <Navbar />
            {children}
            <div className="mt-auto">
                <div className="mt-10">
                    <Footer />
                </div>
            </div>
        </div>
    </>
}