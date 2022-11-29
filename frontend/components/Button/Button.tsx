import Link from "next/link";

export type ButtonProps = {
    /** The content inside the Button */
    children: string
    /** Which type of button we want, tertiary has the style of a link */
    kind?: "primary" | "secondary" | "tertiary"
    /** Force color */
    isColored?: boolean
    /** Button type default is "button" */
    type?: "button" | "reset" | "submit"
    /** Function that happens when you click button */
    onClick?: (values: any) => void
    /** Link to go when you click button */
    to?: string
    /** Optional prop to specify icon */
    icon?: string
    /** Specify the location of the icon */
    iconSlot?: "start" | "end"
    /** Can add classes to customize margins for example */
    className?: string
    /** Disabled state when set to true button is disabled */
    disabled?: boolean
    /** Loading state when set to true button is loading */
    loading?: boolean
    /** For testing */
    datacy?: string
}

/**
 *  Button component (with link and button functionality), can look like a link when kind tertiary
 */
export const Button: React.FC<ButtonProps> = ({ kind = "primary", disabled, icon, datacy, iconSlot = "start", loading, className, children, to, onClick, isColored = false, type = "button" }) => {
    // When loading should be disabled
    disabled = loading ? true : disabled

    const tertiaryColor = isColored ? "blue" : "grey"

    // Base Classes 
    const buttonBaseClasses = "flex items-center justify-center md:justify-start font-semibold border border-transparent rounded-full py-2 px-8 w-full md:w-max"
    const linkBaseClasses = `flex items-center font-semibold text-${tertiaryColor}-600`

    // Disable state classes
    const disabledClassesPrimarySecondary = "text-opacity-75 opacity-80 cursor-default"
    const disabledPrimary = disabled ? disabledClassesPrimarySecondary : "hover:bg-blue-600 focus:bg-blue-700"
    const disabledSecondary = disabled ? disabledClassesPrimarySecondary : "hover:bg-blue-500 focus:bg-blue-600 hover:text-white focus:text-white"
    const disabledTertiary = disabled ? disabledClassesPrimarySecondary : `hover:text-${tertiaryColor}-700 focus:text-${tertiaryColor}-800`

    // Kind classes
    const primaryClasses = `bg-blue-500 text-white ${disabledPrimary}`
    const secondaryClasses = `border border-blue-500 text-blue-500 ${disabledSecondary}`

    const innerContent = <>
        {icon && iconSlot === "start" && (loading ? <i className={`material-symbols-rounded text-xl mr-1 ${loading ? "animate-spin" : ""}`}>sync</i> : <i className="material-symbols-rounded text-xl mr-1">{icon}</i>)}
        {children}
        {icon && iconSlot === "end" && <span className="material-symbols-rounded text-xl ml-2">{icon}</span>}
    </>

    return (<>
        {/* Primary or Secondary as link */}
        {kind !== "tertiary" && to && <Link datacy={datacy} href={disabled ? "" : to} onClick={disabled ? (event) => event.preventDefault() : () => ""} tabIndex={disabled ? -1 : 0} className={`${buttonBaseClasses} ${kind === "primary" ? primaryClasses : secondaryClasses} ${className}`}>
            {innerContent}
        </Link>}

        {/* Primary or Secondary as button */}
        {kind !== "tertiary" && !to && <button datacy={datacy} disabled={disabled} onClick={disabled ? () => "" : onClick} type={type} className={`${buttonBaseClasses} ${kind === "primary" ? primaryClasses : secondaryClasses} ${className}`}>
            {innerContent}
        </button>}

        {/* Tertiary (link style) as link */}
        {kind === "tertiary" && to && <Link datacy={datacy} href={disabled ? "" : to} onClick={disabled ? (event) => event.preventDefault() : () => ""} tabIndex={disabled ? -1 : 0} className={`${linkBaseClasses} w-max ${disabledTertiary} ${className}`}>
            {innerContent}
        </Link>}

        {/* Tertiary (link style) as button */}
        {kind === "tertiary" && !to && <button datacy={datacy} disabled={disabled} onClick={disabled ? () => "" : onClick} type={type} className={`${linkBaseClasses} ${disabledTertiary} ${className}`}>
            {innerContent}
        </button>}
    </>)
}