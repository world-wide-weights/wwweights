import { PageLayout } from "../../components/Layout/PageLayout"
import { NextPageCustomProps } from "../_app"

/**
 * Legal page, contains terms of use.
 */
const TermsOfUse: NextPageCustomProps = () => {
    return <>

    </>
}

TermsOfUse.getLayout = (page) => {
    return <PageLayout title="Terms of use">
        {page}
    </PageLayout>
}

export default TermsOfUse
