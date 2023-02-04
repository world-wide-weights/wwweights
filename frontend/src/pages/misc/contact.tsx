import { PageLayout } from "../../components/Layout/PageLayout"
import { NextPageCustomProps } from "../_app"

/**
 * Contact page, contains email where the people can contact us.
 */
const Contact: NextPageCustomProps = () => {
    return <>

    </>
}

Contact.getLayout = (page) => {
    return <PageLayout title="Contact">
        {page}
    </PageLayout>
}

export default Contact
