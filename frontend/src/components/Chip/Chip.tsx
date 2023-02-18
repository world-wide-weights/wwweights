import Link from "next/link"
import { Color } from "../../types/color"
import { Icon } from "../Icon/Icon"

type ChipProps = {
    /** Content of tag */
    children: React.ReactNode
    /** href destination Link */
    to?: string
    /** Function gets called when click on chip */
    onClick?: (values: any) => void
    /** Possibility to change color and background of tag */
    color?: Color
    /** Specify whether the chip should be disabled, or not */
    disabled?: boolean
    /** Optional property to dim the opacity of the chip when it is disabled */
    dimOpacityWhenDisabled?: boolean
    /** Adds icon at the start of chip. */
    iconStart?: string
    /** Adds icon at the end of chip. */
    iconEnd?: string
    /** Whether the chip should have margin bottom or not. */
    hasMargin?: boolean
    /** For testing. */
    datacy?: string
}

/**
 * Chip which can be just display a tag or be a link
 * @example <Chip>Tag</Chip>
 */
export const Chip: React.FC<ChipProps> = ({ children, to, onClick, iconEnd, hasMargin = true, iconStart, datacy, disabled, dimOpacityWhenDisabled = true, color = "blue" }) => {
    if (onClick && to)
        return <p>Use &quot;onClick&quot; prop or &quot;to&quot; prop not both!</p>

    const content = <>
        {iconStart && <Icon className="text-xl mr-1">{iconStart}</Icon>}
        {children}
        {iconEnd && <Icon className="text-xl ml-1">{iconEnd}</Icon>}
    </>

    return <>
        {/* Chip with onclick */}
        {!to && <button datacy={datacy} type="button" disabled={disabled} onClick={onClick} className={`inline-flex items-center bg-${color}-500 bg-opacity-20 ${disabled && dimOpacityWhenDisabled ? "text-opacity-60" : ""} text-${color}-600 rounded-full whitespace-nowrap px-5 py-1 mr-2 ${hasMargin ? "mb-2" : ""}`}>
            {content}
        </button>}

        {/* Chip as link */}
        {to && <Link datacy={datacy} href={to} onClick={disabled ? (event) => event.preventDefault() : () => ""} className={`inline-block bg-${color}-500 ${disabled ? "cursor-default" : ""} ${disabled && dimOpacityWhenDisabled ? "text-opacity-60" : ""} bg-opacity-20 text-${color}-600 rounded-full whitespace-nowrap px-5 py-1 mr-2 ${hasMargin ? "mb-2" : ""}`}>
            {content}
        </Link>}
    </>
}
