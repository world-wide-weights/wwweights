import Link from "next/link"

type IconButtonProps = {
    /** icon of the icon button */
    icon: string
    /** optional icon color */
    color?: "red"
    | "indigo"
    | "pink"
    | "cyan"
    | "blue"
    | "emerald"
    | "amber"
    | "gray"
    | "slate"
    | "zinc"
    | "neutral"
    | "stone"
    | "orange"
    | "yellow"
    | "lime"
    | "green"
    | "teal"
    | "sky"
    | "violet"
    | "purple"
    | "fuchsia"
    | "rose"
    /** Disable button */
    disabled?: boolean
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
export const IconButton: React.FunctionComponent<IconButtonProps> = ({ icon, to, onClick, disabled, className = "", color = "gray" }) => {
    const innerIcon = <i className={`material-symbols-rounded ${disabled ? "text-opacity-50 cursor-default" : ""} text-${color}-600`}>{icon}</i>
    const classes = `cursor-pointer hover:bg-${color}-200 focus:bg-${color}-300 rounded-full w-10 h-10 flex items-center justify-center ${className}`

    return <>
        {/* Button as link */}
        {to && <Link href={to} onClick={disabled ? (event) => event.preventDefault() : () => ""} className={classes}>
            {innerIcon}
        </Link>}

        {/* Button with onclick */}
        {!to && <button type="button" disabled={disabled} onClick={onClick} className={classes}>
            {innerIcon}
        </button>}
    </>
}