import Image from "next/image"
import email from "../../../public/email.png"
import { PageLayout } from "../../components/Layout/PageLayout"
import { NextPageCustomProps } from "../_app"

/**
 * Contact page, contains email where the people can contact us.
 */
const Contact: NextPageCustomProps = () => {
    return <>
        <p className="mb-2">You are more than welcome to share feedback and request with us. If you need to contact us, please use the following mail:</p>
        <Image alt="Image of E-Mail Adresse" src={email} />
    </>
}

Contact.getLayout = (page) => {
    return <PageLayout title="Contact">
        {page}
    </PageLayout>
}

export default Contact
