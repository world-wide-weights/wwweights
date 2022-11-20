import Link from "next/link";

export type ButtonProps = {
    /** The content inside the Button */
    children: string
    /** Which type of button we want, tertiary has the style of a link */
    kind?: "primary" | "secondary" | "tertiary"
    /** Button type default is "button" */
    type?: "button" | "reset" | "submit"
    /** Function that happens when you click button */
    onClick?: (values: any) => void
    /** Link to go when you click button */
    to?: string
    /** Icon before the text */
    icon?: string
    /** Can add classes to customize margins for example */
    className?: string
    /** Disabled state when set to true button is disabled */
    disabled?: boolean
    /** Loading state when set to true button is loading */
    loading?: boolean
}

/**
 *  Button component, can also be a link when kind tertiary
 */
export const Button: React.FC<ButtonProps> = ({ kind = "primary", disabled, icon, loading, className, children, to, onClick, type = "button" }) => {
    disabled = loading ? true : disabled

    // TODO (Zoe-Bot): Maybe this should be improved
    const disabledClassesPrimarySecondary = "text-opacity-75 opacity-80 cursor-default"
    const disabledClassesTertiary = "text-opacity-75 opacity-80 cursor-default"

    return (<>
        {kind === "tertiary" ?
            to ?
                <Link href={disabled ? "" : to} onClick={disabled ? (event) => event.preventDefault() : () => ""} tabIndex={disabled ? -1 : 0} className={`flex items-center text-gray-600 font-semibold w-max ${disabled ? disabledClassesTertiary : "hover:text-gray-800 focus:text-gray-900"} ${className}`}>
                    {icon && (loading ? <span className={`material-symbols-outlined text-xl mr-1 ${loading ? "animate-spin" : ""}`}>sync</span> : <span className="material-symbols-outlined text-xl mr-1">{icon}</span>)}
                    {children}
                </Link>
                :
                <button disabled={disabled} onClick={disabled ? () => "" : onClick} type={type} className={`flex items-center text-gray-600 font-semibold ${disabled ? disabledClassesTertiary : "hover:text-gray-800 focus:text-gray-900"} ${className}`}>
                    {icon && (loading ? <span className={`material-symbols-outlined text-xl mr-1 ${loading ? "animate-spin" : ""}`}>sync</span> : <span className="material-symbols-outlined text-xl mr-1">{icon}</span>)}
                    {children}
                </button>
            :
            to ?
                <Link href={disabled ? "" : to} onClick={disabled ? (event) => event.preventDefault() : () => ""} tabIndex={disabled ? -1 : 0} className={`flex items-center justify-center md:justify-start font-semibold border border-transparent rounded-full py-2 px-8 w-full md:w-max ${kind === "primary" ? `bg-blue-500 text-white ${disabled ? disabledClassesPrimarySecondary : "hover:bg-blue-600 focus:bg-blue-700"}` : `border border-blue-500 text-blue-500 ${disabled ? disabledClassesPrimarySecondary : "hover:bg-blue-500 focus:bg-blue-600 hover:text-white focus:text-white"}`} ${className}`}>
                    {icon && (loading ? <span className={`material-symbols-outlined text-xl mr-1 ${loading ? "animate-spin" : ""}`}>sync</span> : <span className="material-symbols-outlined text-xl mr-1">{icon}</span>)}
                    {children}
                </Link>
                :
                <button disabled={disabled} onClick={disabled ? () => "" : onClick} type={type} className={`flex items-center justify-center md:justify-start font-semibold border border-transparent rounded-full py-2 px-8 w-full md:w-max ${kind === "primary" ? `bg-blue-500 text-white ${disabled ? disabledClassesPrimarySecondary : "hover:bg-blue-600 focus:bg-blue-700"}` : `border border-blue-500 text-blue-500 ${disabled ? disabledClassesPrimarySecondary : "hover:bg-blue-500 focus:bg-blue-600 hover:text-white focus:text-white"}`} ${className}`}>
                    {icon && (loading ? <span className={`material-symbols-outlined text-xl mr-1 ${loading ? "animate-spin" : ""}`}>sync</span> : <span className="material-symbols-outlined text-xl mr-1">{icon}</span>)}
                    {children}
                </button>
        }</>)
}