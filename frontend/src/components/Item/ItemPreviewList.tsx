import Image from "next/image"
import Link from "next/link"
import { routes } from "../../services/routes/routes"
import { renderUnitIntoString, renderWeightAsNumberIntoString } from "../../services/unit/unitRenderer"
import { generateWeightProgressBarPercentage } from "../../services/utils/weight"
import { Weight } from "../../types/item"
import { Icon } from "../Icon/Icon"
import { ProgressBar } from "../ProgressBar/ProgressBar"
import { Tooltip } from "../Tooltip/Tooltip"

export type ItemPreviewListProps = {
    /** Name of item. */
    name: string
    /** Weight. */
    weight: Weight
    /** Slug of item. */
    slug: string
    /** Image URL. */
    imageUrl?: string
    /** For testing. */
    datacy?: string
    /** Sets custom background color. */
    bgColor?: string
    /** Shows difference to other item when positive it is green, when negative it is red. */
    difference?: number
    /** When true the item will be highlighted. */
    selectedItem?: boolean
    /** When true disable link. */
    disableLink?: boolean
    /** Heaviest weight. */
    heaviestWeight: Weight
}

/**
 * Excerpt component for Item
 * 
 * Example:
 * ```tsx
 * <ItemPreviewList name="Smartphone" slug="smartphone" weight={{ value: 100, isCa: false }} heaviestWeight={{ value: 100, isCa: false }} imageUrl="https://via.placeholder.com/96.png" />
 * ```
 */
export const ItemPreviewList: React.FC<ItemPreviewListProps> = ({ slug, name, weight, heaviestWeight, difference, selectedItem, disableLink, imageUrl, datacy, bgColor = "bg-white", }) => {
    const weightString = renderUnitIntoString(weight)
    const percentageProgressbar = generateWeightProgressBarPercentage(weight, heaviestWeight)
    const hasDifference = (difference || difference === 0)

    return <li className={`${bgColor} rounded-lg py-4 px-2 md:px-0 md:py-2 mb-2`}>
        <Link onClick={disableLink ? (event) => event.preventDefault() : () => ""} datacy={datacy} className={`${disableLink ? "cursor-default" : ""} flex flex-col md:flex-row md:items-center md:h-12 mx-2 md:mx-4`} href={disableLink ? "#" : routes.weights.single(slug)}>
            <div className="flex justify-between items-center h-12 md:w-1/3">
                {/* Name */}
                <Tooltip position="left" content={name}>
                    <h5 datacy="itempreviewlist-name" className={`${selectedItem ? "font-bold" : "text-gray-600 font-medium"} w-72 sm:w-48 truncate pr-3`}>{name}</h5>
                </Tooltip>

                {/* Image */}
                <div className="min-w-[48px] w-[48px]">
                    {imageUrl && <Image datacy="itempreviewlist-image" className="object-cover rounded-lg w-12 h-12 md:mr-5" alt={`Image of ${name}`} src={imageUrl} width={96} height={96} />}
                </div>
            </div>
            <div className={`flex items-center ${hasDifference && selectedItem ? "justify-end" : ""} md:w-2/3`}>
                {/* Difference */}
                {hasDifference && !selectedItem && <div datacy="itempreviewlist-difference" className={`flex items-center justify-center ${difference === 0 ? "text-gray-500" : (difference > 0 ? "text-green-500" : "text-red-500")} md:px-3 lg:px-0 w-2/6 md:w-1/4`}>
                    <span className="font-medium mr-1">{renderWeightAsNumberIntoString(Math.abs(difference))}</span>
                    <Icon datacy="arrow-icon" className="text-xl">{difference === 0 ? "remove" : (difference >= 0 ? "arrow_upward" : "arrow_downward")}</Icon>
                </div>}

                {/* Weight */}
                <Tooltip content={`${name} has a weight of ${weightString}`}>
                    <h5 datacy="itempreviewlist-weight" className={`${selectedItem ? "text-blue-500" : "text-gray-800"} text-right font-bold w-52 lg:w-48 pl-5 truncate ${hasDifference ? selectedItem ? "w-2/3 md:w-1/4" : "w-3/6 md:w-1/4" : "w-1/3"} mr-4`}>{weightString}</h5>
                </Tooltip>

                {/* Progress bar */}
                <div className={`${hasDifference ? "w-1/5 md:w-2/4" : "w-full"}`}>
                    <ProgressBar progress={percentageProgressbar.percentage} isCa={weight.isCa} progressAdditional={percentageProgressbar.percentageAdditional} />
                </div>
            </div>
        </Link>
    </li >
}