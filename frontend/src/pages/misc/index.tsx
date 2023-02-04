import { PageLayout } from "../../components/Layout/PageLayout"
import { NextPageCustomProps } from "../_app"

/**
 * Index page for miscelaneous pages like legal and contact.
 */
const Misc: NextPageCustomProps = () => {
    return <>

    </>
}

Misc.getLayout = (page) => {
    return <PageLayout title="Misc">
        {page}
    </PageLayout>
}


export default Misc