import Link from "next/link"
import { Color } from "../../types/color"

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
    /** Add disabled state */
    disabled?: boolean
    /** For testing */
    dataCy?: string
}

/**
 * Button only with an icon
 */
export const IconButton: React.FunctionComponent<IconButtonProps> = ({ icon, to, onClick, dataCy, disabled, className = "", color = "gray" }) => {
    const innerIcon = <i className={`material-symbols-rounded ${disabled ? "text-opacity-50 cursor-default" : ""} text-${color}-600`}>{icon}</i>
    const classes = `cursor-pointer hover:bg-${color}-100 focus:bg-${color}-200 rounded-full w-10 h-10 flex items-center justify-center ${className}`

    return <>
        {/* Button as link */}
        {to && <Link dataCy={dataCy} href={disabled ? "" : to} onClick={disabled ? (event) => event.preventDefault() : () => ""} className={classes}>
            {innerIcon}
        </Link>}

        {/* Button with onclick */}
        {!to && <button dataCy={dataCy} type="button" onClick={onClick} disabled={disabled} className={classes}>
            {innerIcon}
        </button>}
    </>
}