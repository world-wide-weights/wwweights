import Link from "next/link"
import { Color } from "../../types/color"
import { Icon } from "../Icon/Icon"

type IconButtonProps = {
	/** Specify the icon */
	icon: string
	/** Optional property to set the color of the icon button */
	color?: Color
	/** Optional specify an href for your Button to become an `<a>` element */
	to?: string
	/** Optional callback function to handle click events on the icon button */
	onClick?: (values: any) => void
	/** Optional class name for custom styling of the icon button */
	className?: string
	/** Optional class name for custom styling of the icon. */
	iconClassName?: string
	/** Specify whether the Button should be disabled, or not */
	disabled?: boolean
	/** Optional property to dim the opacity of the icon button when it is disabled */
	dimOpacityWhenDisabled?: boolean
	/** Optional property to set the data-cy attribute for testing purposes */
	datacy?: string
}

/**
 * Button only as Icon. Can be used as a link or with an onClick function.
 * @example <IconButton icon="home" to="/home" />
 */
export const IconButton: React.FC<IconButtonProps> = ({
	icon,
	to,
	onClick,
	datacy,
	iconClassName = "",
	disabled = false,
	className = "",
	color = "gray",
	dimOpacityWhenDisabled = true,
}) => {
	const innerIcon = <Icon className={`${disabled && dimOpacityWhenDisabled ? "text-opacity-50 " : ""}text-${color}-600 ${iconClassName}`}>{icon}</Icon>
	const classes = `text-center ${
		disabled ? "cursor-default" : `cursor-pointer hover:bg-${color}-200 focus:bg-${color}-300`
	} rounded-full w-10 h-10 flex items-center justify-center ${className}`

	return (
		<>
			{/* Button as link */}
			{to && (
				<Link datacy={datacy} href={disabled ? "" : to} onClick={disabled ? (event) => event.preventDefault() : () => ""} className={classes}>
					{innerIcon}
				</Link>
			)}

			{/* Button with onclick */}
			{!to && (
				<button datacy={datacy} type="button" onClick={onClick} disabled={disabled} className={classes}>
					{innerIcon}
				</button>
			)}
		</>
	)
}
