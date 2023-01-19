import Link from "next/link"
import { Color } from "../../types/color"
import { Icon } from "../Icon/Icon"

type IconButtonProps = {
    /** icon of the icon button */
    icon: string
    /** optional icon color */
    color?: Color
    /** Optionally specify an href for your Button to become an `<a>` element */
    to?: string
    /** function that happens when you click button */
    onClick?: (values: any) => void
    /** Optional can add classes to customize margins for example */
    className?: string
    /** Optional can add classes to icon to adjust size for example. */
    iconClassName?: string
    /** Specify whether the Button should be disabled, or not */
    disabled?: boolean
    /** Dim opacity when button is disabled. */
    dimOpacityWhenDisabled?: boolean
    /** For testing */
    datacy?: string
}

/**
 * Button only with an icon
 */
export const IconButton: React.FC<IconButtonProps> = ({ icon, to, onClick, datacy, iconClassName = "", disabled = false, className = "", color = "gray", dimOpacityWhenDisabled = true }) => {
    const innerIcon = <Icon className={`${disabled && dimOpacityWhenDisabled ? "text-opacity-50 " : ""}text-${color}-600 ${iconClassName}`}>{icon}</Icon>
    const classes = `text-center ${disabled ? "cursor-default" : `cursor-pointer hover:bg-${color}-200 focus:bg-${color}-300`} rounded-full w-10 h-10 flex items-center justify-center ${className}`

    return <>
        {/* Button as link */}
        {to && <Link datacy={datacy} href={disabled ? "" : to} onClick={disabled ? (event) => event.preventDefault() : () => ""} className={classes}>
            {innerIcon}
        </Link>}

        {/* Button with onclick */}
        {!to && <button datacy={datacy} type="button" onClick={onClick} disabled={disabled} className={classes}>
            {innerIcon}
        </button>}
    </>
}