import Link from "next/link"
import { Icon } from "../Icon/Icon"

type CardProps = {
    /** Icon displays in front of value and descriptions */
    icon: string
    /** Description above value */
    descriptionTop?: string
    /** Most important information for example: weight */
    value: string
    /** Description below value */
    descriptionBottom?: string
    /** Optionally specify an href for your Card to become an <a> element. */
    to?: string
    /** Custom classname */
    classNameWrapper?: string
    /** When true no word wrapping or ellipsis text overflow. */
    noTruncate?: boolean
}

/**
 * Displays Card with an big icon left, values and descriptions
 * @example <Card icon="home" value="Home" descriptionTop="Home" descriptionBottom="Home" />
 */
export const Card: React.FC<CardProps> = ({ icon, descriptionTop, value, descriptionBottom, to, classNameWrapper = "", noTruncate = false }) => {
    const CustomTag = to ? Link : "div"

    return <CustomTag href={to ?? "#"} className={`flex items-center bg-white rounded-lg py-4 px-6 ${classNameWrapper}`}>
        {/* Icon */}
        <div className="flex items-center justify-center bg-blue-200 rounded-full w-14 h-14 min-w-[56px] mr-6">
            <Icon className="text-blue-700 text-3xl" isFilled>{icon}</Icon>
        </div>

        {/* Value and descriptions */}
        <div>
            {descriptionTop && <div title={descriptionTop} className={`font-medium text-gray-600 ${noTruncate ? "" : " w-40 truncate break-words"}`}>{descriptionTop}</div>}
            <h5 title={value} className={`font-bold text-xl  ${noTruncate ? "" : "w-32 truncate"} leading-6`}>{value}</h5>
            {descriptionBottom && <p className="text-gray-700">{descriptionBottom}</p>}
        </div>
    </CustomTag>
}