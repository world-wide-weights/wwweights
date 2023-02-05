import Image from "next/image"
import email from "../../../public/email.png"
import discord from "../../assets/img/logos/discord-logo-blue.svg"
import github from "../../assets/img/logos/github-logo.png"
import { PageLayout } from "../../components/Layout/PageLayout"
import { NextPageCustomProps } from "../_app"

/**
 * Contact page, contains email where the people can contact us.
 */
const Contact: NextPageCustomProps = () => {
    return <>
        <Image className="mb-4" alt="Image of E-Mail Adresse" src={email} />
        <p className="mb-4">You are more than welcome to share feedback and request with us.</p>
        <div className="flex">
            <a href="https://discord.gg/UmxWf2FEQx" className="mb-2 mr-2" target="_blank" title="Link to our discord server!" rel="noreferrer">
                <Image height={40} alt="Image of Discord Logo" src={discord} />
            </a>
            <a href="https://github.com/world-wide-weights" className="mb-2" target="_blank" title="Link to our GitHub Orga!" rel="noreferrer">
                <Image height={40} alt="Image of GitHub Logo" src={github} />
            </a>
        </div>
    </>
}

Contact.getLayout = (page) => {
    return <PageLayout title="Contact">
        {page}
    </PageLayout>
}

export default Contact
