import Image from "next/image"
import email from "../../../public/email.png"
import discord from "../../assets/img/logos/discord-logo-blue.svg"
import github from "../../assets/img/logos/github-logo.png"
import twitter from "../../assets/img/logos/twitter-logo-blue.svg"
import { PageLayout } from "../../components/Layout/PageLayout"
import { Seo } from "../../components/Seo/Seo"
import { Tooltip } from "../../components/Tooltip/Tooltip"
import { NextPageCustomProps } from "../_app"

/**
 * Contact page, contains email where the people can contact us.
 */
const Contact: NextPageCustomProps = () => {
    return <>
        <Seo
            title="Contact Information for World Wide Weights"
            description="Contact us via email or social media!"
        />

        {/* Contact Information */}
        <Image className="mb-4" alt="Image of E-Mail Adresse" src={email} />
        <p className="mb-4">You are more than welcome to share feedback and request with us.</p>

        {/* Social Media */}
        <div className="flex">
            <Tooltip content="Link to our discord server!">
                <a href="https://discord.gg/UmxWf2FEQx" target="_blank" rel="noreferrer noopener">
                    <Image src={discord} alt="Image of Discord Logo" height={40} />
                </a>
            </Tooltip>
            <Tooltip content="Link to our GitHub Orga!">
                <a href="https://github.com/world-wide-weights" target="_blank" rel="noreferrer noopener">
                    <Image src={github} alt="Image of Github Logo" height={40} />
                </a>
            </Tooltip>
            <Tooltip content="Link to our Twitter!">
                <a href="https://twitter.com/wwweights" target="_blank" rel="noreferrer noopener">
                    <Image src={twitter} alt="Image of Twitter logo" height={40} />
                </a>
            </Tooltip>
        </div>
    </>
}

Contact.layout = (page) => {
    return <PageLayout title="Contact">
        {page}
    </PageLayout>
}

export default Contact
