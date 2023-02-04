import { PageLayout } from "../../components/Layout/PageLayout"
import { NextPageCustomProps } from "../_app"

/**
 * Legal page, contains privacy policy with cookies.
 */
const PrivacyPolicy: NextPageCustomProps = () => {
    return <>

    </>
}

PrivacyPolicy.getLayout = (page) => {
    return <PageLayout title="Contact">
        {page}
    </PageLayout>
}

export default PrivacyPolicy
