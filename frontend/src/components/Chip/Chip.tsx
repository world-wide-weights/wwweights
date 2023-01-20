import Link from "next/link"
import { Color } from "../../types/color"

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
  /** For testing. */
  dataCy?: string
}

/**
 * Chip which can be just display a tag or be a link
 */
export const Chip: React.FC<ChipProps> = ({ children, to, onClick, dataCy, disabled, dimOpacityWhenDisabled = true, color = "blue" }) => {
  if (onClick && to)
    return <p>Use &quot;onClick&quot; prop or &quot;to&quot; prop not both!</p>

  return <>
    {!to && <button datacy={dataCy} type="button" disabled={disabled} onClick={onClick} className={`inline-block bg-${color}-500 bg-opacity-20 ${disabled && dimOpacityWhenDisabled ? "text-opacity-60" : ""} text-${color}-600 rounded-full whitespace-nowrap px-5 py-1 mr-2 mb-2`}>
      {children}
    </button>}
    {to && <Link datacy={dataCy} href={to} onClick={disabled ? (event) => event.preventDefault() : () => ""} className={`inline-block bg-${color}-500 ${disabled ? "cursor-default" : ""} ${disabled && dimOpacityWhenDisabled ? "text-opacity-60" : ""} bg-opacity-20 text-${color}-600 rounded-full whitespace-nowrap px-5 py-1 mr-2 mb-2`}>
      {children}
    </Link>}
  </>
}
