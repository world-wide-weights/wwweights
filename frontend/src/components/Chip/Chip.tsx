import Link from "next/link";
import { Color } from "../../types/color";

type ChipProps = {
  /** Content of tag */
  children: React.ReactNode
  /** href destination Link */
  to: string
  /** Possibility to change color and background of tag */
  color?: Color
}

/**
 * Chip which can be just display a tag or be a link
 */
export const Chip: React.FC<ChipProps> = ({ children, to, color = "blue" }) => {
  return (
    <Link href={to} className={`inline-block bg-${color}-500 bg-opacity-20 text-${color}-600 rounded-full whitespace-nowrap px-5 py-1 mr-2 mb-2`}>
      {children}
    </Link>
  )
}
