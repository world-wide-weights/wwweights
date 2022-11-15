import { Footer } from "../Footer/Footer"
import { Navbar } from "../Navbar/Navbar"

type LayoutProps = {
    children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <Navbar />
            <main>{children}</main>
            <div className="mt-auto">
                <Footer />
            </div>
        </div>
    )
}