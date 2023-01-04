import Link from "next/link"
import { Icon } from "../Icon/Icon"

type LinkWithIconColoredProps = {
    /** Text below icon. Should inform where the link is going. */
    text: string
    /** icon of the icon button */
    icon: string
    /** Link where it goes when you click. */
    to: string
    /** For testing */
    datacy?: string
}

/**
 * Button only with an icon
 */
export const LinkWithIconColored: React.FC<LinkWithIconColoredProps> = ({ icon, to, text, datacy }) => {
    return <Link datacy={datacy} href={to} className="flex flex-col items-center">
        <div className="flex items-center justify-center bg-blue-200 rounded-full w-14 h-14 min-w-[56px] mb-2">
            <Icon className="text-blue-700 text-3xl" isFilled>{icon}</Icon>
        </div>
        <h6 className="font-medium text-center text-blue-700">{text}</h6>
    </Link>
}