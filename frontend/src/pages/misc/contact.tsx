import { PageLayout } from "../../components/Layout/PageLayout"
import { NextPageCustomProps } from "../_app"

/**
 * Contact page, contains email where the people can contact us.
 */
const Contact: NextPageCustomProps = () => {
    return <>
        <p className="mb-2">You are more than welcome to share feedback and request with us. If you need to contact us, please use the following mail:</p>
        <a className="text-blue-500 hover:text-blue-700" href="mailto:support@wwweights.com">support@wwweights.com</a>
    </>
}

Contact.getLayout = (page) => {
    return <PageLayout title="Contact">
        {page}
    </PageLayout>
}

export default Contact
