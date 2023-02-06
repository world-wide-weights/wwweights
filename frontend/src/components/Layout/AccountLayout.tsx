import Image from "next/image"
import Link from "next/link"
import logo from "../../../public/logo.png"
import { routes } from "../../services/routes/routes"
import { Button } from "../Button/Button"
import { Headline } from "../Headline/Headline"

type AccountLayoutProps = {
    /** Page content. Is parameter in getLayout. */
    page: React.ReactElement
    /** Title in head. */
    siteTitle: string
    /** Headline text. */
    headline: string
    /** Short description shown below headline. */
    description: string
    /** Short description in image below headline. */
    descriptionImage: string
}

/**
 * Layout Wrapper for Register and Login Pages (Account).
 * Adds image right, centers the content horizontal, adds header information and add footer at bottom of the page.
 */
export const AccountLayout: React.FC<AccountLayoutProps> = ({ page, headline, description, descriptionImage, siteTitle }) => {
    return <>
        <div className="lg:flex h-screen">
            {/* Left Side Content: Form */}
            <div className="flex flex-col lg:grid lg:grid-rows-5 lg:w-1/2 h-screen">

                {/* Content */}
                <main className="container row-start-2 mt-10 lg:mt-0">

                    {/* Header */}
                    <Link href={routes.home}>
                        <Image src={logo} alt="Logo" className="min-w-[40px] w-[40px] mb-12 lg:mb-14" />
                    </Link>
                    <Headline>{headline}</Headline>
                    <p className="mb-4 lg:mb-5">{description}</p>
                    {page}
                </main>

                {/* Footer */}
                <footer className="container row-start-5 mt-auto">
                    <ul className="flex gap-3 py-4">
                        <li><Button to={routes.misc.contact} kind="tertiary">Contact</Button></li>
                        <li><Button to={routes.misc.privacy} kind="tertiary">Privacy Policy</Button></li>
                        <li><Button to={routes.misc.terms} kind="tertiary">Terms and Conditions</Button></li>
                    </ul>
                </footer>
            </div>

            {/* Right Side Content: Image */}
            <div className={"hidden lg:flex items-center justify-center bg-background-half-page bg-no-repeat bg-cover bg-center w-1/2"}>
                <div className="text-white font-bold w-1/2">
                    <h5 className="text-5xl leading-snug mb-5"><span className="text-blue-300">Weigh</span> something and wanna share it with people?</h5>
                    <h6 className="text-2xl">{descriptionImage}</h6>
                </div>
            </div>
        </div>
    </>
}
