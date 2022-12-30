import { routes } from "../../services/routes/routes"
import { Button } from "../Button/Button"

type AccountLayoutProps = {
    page: React.ReactElement
}

export const AccountLayout: React.FC<AccountLayoutProps> = ({ page }) => {
    return <div className="lg:flex h-screen">
        {/* Left Side Content: Form */}
        <div className="flex flex-col lg:grid lg:grid-rows-5 lg:w-1/2 h-screen">

            {/* Content */}
            <main className="container row-start-2 mt-10 lg:mt-0">
                {page}
            </main>

            {/* Footer */}
            <footer className="container row-start-5 mt-auto">
                <ul className="flex gap-3 py-4">
                    <li><Button to={routes.legal.terms} kind="tertiary">Terms of Service</Button></li>
                    <li><Button to={routes.legal.privacy} kind="tertiary">Privacy Policy</Button></li>
                </ul>
            </footer>
        </div>

        {/* Right Side Content: Image */}
        <div className={`hidden lg:flex items-center justify-center bg-background-half-page bg-no-repeat bg-cover bg-center w-1/2`}>
            <div className="text-white font-bold w-1/2">
                <h5 className="text-5xl leading-snug mb-5"><span className="text-blue-300">Weight</span> something and wanna share with people?</h5>
                <h6 className="text-2xl">Login to share your stuff</h6>
            </div>
        </div>
    </div>
}
