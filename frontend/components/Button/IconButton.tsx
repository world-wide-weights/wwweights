import Link from "next/link"
import { Color } from "../../types/type"

type IconButtonProps = {
    /** icon of the icon button */
    icon: string
    /** optional icon color */
    color?: Color
    /** link to go when you click button */
    to?: string
    /** function that happens when you click button */
    onClick?: (values: any) => void
    /** Optional can add classes to customize margins for example */
    className?: string
}

/**
 * Button only with an icon
 */
export const IconButton: React.FunctionComponent<IconButtonProps> = ({ icon, to, onClick, className = "", color = "gray" }) => {
    const innerIcon = <i className={`material-symbols-rounded text-${color}-600`}>{icon}</i>
    const classes = `cursor-pointer hover:bg-${color}-200 focus:bg-${color}-300 rounded-full w-10 h-10 flex items-center justify-center ${className}`

    return <>
        {/* Button as link */}
        {to && <Link href={to} className={classes}>
            {innerIcon}
        </Link>}

        {/* Button with onclick */}
        {!to && <button type="button" onClick={onClick} className={classes}>
            {innerIcon}
        </button>}
    </>
}