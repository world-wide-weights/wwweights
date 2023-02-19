import { Icon } from "../../Icon/Icon"

type CustomSelectionButtonProps = {
	/** If the button is active or not. */
	active: boolean
	/** The function that is called when the button is clicked. */
	onClick: () => void
	/** The headline in the button. */
	headline: string
	/** The description in the button. */
	description: string
	/** For testing. */
	datacy?: string
}

/**
 * A custom selection button that can be used in a form for a selection between states.
 * @example <CustomSelectionButton active={true} onClick={() => {}} headline="Headline" description="Description" />
 */
export const CustomSelectionButton: React.FC<CustomSelectionButtonProps> = ({ active, onClick, headline, datacy, description }) => {
	return (
		<button
			datacy={datacy}
			type="button"
			onClick={onClick}
			disabled={active}
			className={`flex items-center flex-col border-2 transition duration-200 ease-in-out ${
				active ? "border-blue-500 " : "border-gray-100"
			} bg-gray-100 rounded-lg pt-1 pb-3 px-4`}
		>
			{active && <Icon className="text-blue-500 h-4 ml-auto">check</Icon>}
			<h6 className={`${active ? "text-blue-500" : "pt-4"} mt-1 md:mt-0 font-medium`}>{headline}</h6>
			<p className="text-gray-600">{description}</p>
		</button>
	)
}
