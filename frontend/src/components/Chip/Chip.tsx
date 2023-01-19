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
  /** For testing. */
  dataCy?: string
}

/**
 * Chip which can be just display a tag or be a link
 */
export const Chip: React.FC<ChipProps> = ({ children, to, onClick, dataCy, color = "blue" }) => {
  if (onClick && to)
    return <p>Use &quot;onClick&quot; prop or &quot;to&quot; prop not both!</p>

  return <>
    {onClick && <button datacy={dataCy} type="button" onClick={onClick} className={`inline-block bg-${color}-500 bg-opacity-20 text-${color}-600 rounded-full whitespace-nowrap px-5 py-1 mr-2 mb-2`}>
      {children}
    </button>}
    {to && <Link datacy={dataCy} href={to} className={`inline-block bg-${color}-500 bg-opacity-20 text-${color}-600 rounded-full whitespace-nowrap px-5 py-1 mr-2 mb-2`}>
      {children}
    </Link>}
  </>
}
