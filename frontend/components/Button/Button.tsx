import Sync from '@material-symbols/svg-400/outlined/sync.svg';
import Link from "next/link";

export type ButtonProps = {
    /** The text inside the Button */
    children: string
    /** Which type of button we want, tertiary is a link */
    kind?: "primary" | "secondary" | "tertiary"
    /** Button type default is "button" */
    type?: "button" | "reset" | "submit"
    /** Function that happens when you click button */
    onClick?: (values: any) => void
    /** Link to go when you click button */
    to?: string
    /** Icon before the text */
    Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
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
export const Button: React.FC<ButtonProps> = ({ kind = "primary", disabled, loading, className, children, to, onClick, type = "button", ...restprops }) => {
    disabled = loading ? true : disabled

    return (<>
        {kind === "tertiary" ?
            to ?
                <Link href={disabled ? "" : to} className={`text-gray-600 font-semibold ${disabled ? "text-opacity-60 cursor-default" : "hover:text-gray-800 focus:text-gray-900"} ${className}`}>
                    {restprops.Icon && (loading ? <Sync className={`text-sm mr-3 ${loading ? "animate-spin" : ""}`} /> : <restprops.Icon className="text-sm" />)}
                    {children}
                </Link>
                :
                <button disabled={disabled} onClick={disabled ? () => "" : onClick} type={type} className={`text-gray-600 font-semibold ${disabled ? "text-opacity-60 cursor-default" : "hover:text-gray-800 focus:text-gray-900"} ${className}`}>
                    {restprops.Icon && (loading ? <Sync className={`text-sm mr-3 ${loading ? "animate-spin" : ""}`} /> : <restprops.Icon className="text-sm" />)}
                    {children}
                </button>
            :
            to ?
                <Link href={disabled ? "" : to} className={`block text-center font-semibold border border-transparent rounded-xl py-2 px-8 w-full md:w-auto ${kind === "primary" ? `group bg-primary-blue text-white ${disabled ? "text-opacity-75 opacity-80 cursor-default" : "hover:bg-primary-blue-hover"}` : `bg-secondary-blue text-primary-blue-hover ${disabled ? "text-opacity-75 opacity-80 cursor-default" : "hover:bg-secondary-blue-hover"}`} ${className}`}>
                    {restprops.Icon && (loading ? <Sync className={`text-sm mr-3 ${loading ? "animate-spin" : ""}`} /> : <restprops.Icon className="text-sm" />)}
                    {children}
                </Link>
                :
                <button disabled={disabled} onClick={disabled ? () => "" : onClick} type={type} className={`font-semibold border border-transparent rounded-xl py-2 px-8 w-full md:w-auto ${kind === "primary" ? `group bg-primary-blue text-white ${disabled ? "text-opacity-75 opacity-80 cursor-default" : "hover:bg-primary-blue-hover"}` : `bg-secondary-blue text-primary-blue-hover ${disabled ? "text-opacity-75 opacity-80 cursor-default" : "hover:bg-secondary-blue-hover"}`} ${className}`}>
                    {restprops.Icon && (loading ? <Sync className={`text-sm mr-3 ${loading ? "animate-spin" : ""}`} /> : <restprops.Icon className="text-sm" />)}
                    {children}
                </button>
        }</>)
}