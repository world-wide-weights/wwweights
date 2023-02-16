import { CreateEdit } from "../../components/Item/CreateEdit"
import { NextPageCustomProps } from "../_app"

/**
 * Create Item Page.
 */
const CreateItem: NextPageCustomProps = () => {
    return <>
        <CreateEdit />
    </>
}

// Sets route need to be logged in
CreateItem.auth = {
    routeType: "protected"
}

export default CreateItem