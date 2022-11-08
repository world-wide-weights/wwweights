import { Navbar } from "../Navbar/Navbar"

type LayoutProps = {
    children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <>
            <Navbar />
            <main>{children}</main>
            {/* TODO (Zoe-Bot): Add footer when merged */}
        </>
    )
}