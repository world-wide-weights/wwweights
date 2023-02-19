import { Icon } from "../Icon/Icon"

type StatsProps = {
	/** Icon displays at top. */
	icon: string
	/** Important information for example count of weights. */
	value: string
	/** Description below value. */
	description: string
}

/**
 * Displays a Stat with an big icon, value and description.
 * @example <Stat icon="eco" value="100" description="Kg" />
 */
export const Stat: React.FC<StatsProps> = ({ icon, value, description }) => {
	return (
		<div className="flex flex-col items-center">
			{/* Icon */}
			<Icon isFilled className="text-4xl md:text-5xl text-blue-600 mb-2">
				{icon}
			</Icon>

			{/* Content */}
			<h5 className="text-2xl md:text-3xl text-blue-900 font-bold">{value}</h5>
			<span className="text-blue-600">{description}</span>
		</div>
	)
}
