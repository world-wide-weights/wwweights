import { Card } from "../../components/Card/Card"
import { PageLayout } from "../../components/Layout/PageLayout"
import { routes } from "../../services/routes/routes"
import { NextPageCustomProps } from "../_app"

/**
 * Index page for miscelaneous pages like legal and contact.
 */
const Misc: NextPageCustomProps = () => {
    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
        <Card to={routes.misc.contact} icon="comment" value="Contact" descriptionBottom="Contact us when you got any problems or give us feedback." />
        <Card to={routes.misc.privacy} icon="cookie" value="Privacy Policy" descriptionBottom="Get information about your privacy and cookie usage." />
        <Card to={routes.misc.terms} icon="gavel" value="Terms and Conditions" descriptionBottom="Get information about important things when you using our page." />
    </div>
}

Misc.getLayout = (page) => {
    return <PageLayout title="Misc">
        {page}
    </PageLayout>
}


export default Misc