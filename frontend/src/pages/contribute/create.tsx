import { CreateEdit } from "../../components/Item/CreateEdit"
import { Seo } from "../../components/Seo/Seo"
import { NextPageCustomProps } from "../_app"

/**
 * Create Item Page.
 */
const CreateItem: NextPageCustomProps = () => {
	return (
		<>
			{/* Meta Tags */}
			<Seo title="Create new item" description="Contribute to the World Wide Weights database and create a new item." />

			{/* Page Content */}
			<CreateEdit />
		</>
	)
}

// Sets route need to be logged in
CreateItem.auth = {
	routeType: "protected",
}

export default CreateItem
