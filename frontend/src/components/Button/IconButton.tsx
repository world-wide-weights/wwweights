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
    /** Specify whether the Button should be disabled, or not */
    disabled?: boolean
    /** Remove hover and focus effects when active is true. */
    active?: boolean
    /** For testing */
    datacy?: string
}

/**
 * Button only with an icon
 */
export const IconButton: React.FunctionComponent<IconButtonProps> = ({ icon, to, onClick, datacy, disabled = false, active = false, className = "", color = "gray" }) => {
    const innerIcon = <Icon className={`${disabled ? "text-opacity-50 " : ""}text-${color}-600`}>{icon}</Icon>
    const classes = `text-center ${disabled || active ? "cursor-default" : `cursor-pointer hover:bg-${color}-200 focus:bg-${color}-300`} rounded-full w-10 h-10 flex items-center justify-center ${className}`

    return <>
        {/* Button as link */}
        {to && <Link datacy={datacy} href={disabled ? "" : to} onClick={disabled || active ? (event) => event.preventDefault() : () => ""} className={classes}>
            {innerIcon}
        </Link>}

        {/* Button with onclick */}
        {!to && <button datacy={datacy} type="button" onClick={onClick} disabled={disabled || active} className={classes}>
            {innerIcon}
        </button>}
    </>
}