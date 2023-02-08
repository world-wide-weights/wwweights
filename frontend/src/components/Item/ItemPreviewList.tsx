import Image from "next/image"
import Link from "next/link"
import { routes } from "../../services/routes/routes"
import { generateWeightProgressBarPercentage } from "../../services/utils/weight"
import { Weight } from "../../types/item"
import { Icon } from "../Icon/Icon"
import { ProgressBar } from "../ProgressBar/ProgressBar"
import { renderUnitIntoString, renderWeightAsNumberIntoString } from "../../services/unit/unitRenderer"

export type ItemPreviewProps = {
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
    /** Shows difference to other item when positive it is green, when negative it is red. */
    difference?: number
    /** When true the item will be highlighted. */
    selectedItem?: boolean
    /** When true disable link. */
    disableLink?: boolean
}

/**
 * Excerpt component for Item
 * 
 * Example:
 * ```tsx
 * <ItemPreviewList name="Smartphone" slug="smartphone" weight={{ value: 100, isCa: false }} heaviestWeight={{ value: 100, isCa: false }} imageUrl="https://via.placeholder.com/96.png" />
 * ```
 */
export const ItemPreviewList: React.FC<ItemPreviewProps & { heaviestWeight: Weight }> = ({ slug, name, weight, heaviestWeight, difference, selectedItem, disableLink, imageUrl, datacy }) => {
    const weightString = renderUnitIntoString(weight)
    const percentageProgressbar = generateWeightProgressBarPercentage(weight, heaviestWeight)
    const hasDifference = (difference || difference === 0)

    return <li className="bg-white rounded-lg py-4 px-2 md:px-0 md:py-2 mb-2">
        <Link onClick={disableLink ? (event) => event.preventDefault() : () => ""} datacy={datacy} className={`${disableLink ? "cursor-default" : ""} flex flex-col md:flex-row md:items-center md:h-12 mx-2 md:mx-4`} href={disableLink ? "#" : routes.weights.single(slug)}>
            <div className="flex justify-between items-center h-12 md:w-1/3">
                <h5 datacy="item-name" className={`${selectedItem ? "font-bold" : "text-gray-600 font-medium"} truncate pr-3`}>{name}</h5>
                <div className="min-w-[48px] w-[48px]">
                    {imageUrl && <Image datacy="item-image" className="object-cover rounded-lg w-12 h-12 md:mr-5" alt={`Image of ${name}`} src={imageUrl} width={96} height={96} />}
                </div>
            </div>
            <div className={`flex items-center ${hasDifference && selectedItem ? "justify-end" : ""} md:w-2/3`}>
                {hasDifference && !selectedItem && <div datacy="div-difference" className={`flex items-center justify-center ${difference === 0 ? "text-gray-500" : (difference > 0 ? "text-green-500" : "text-red-500")} md:px-3 lg:px-0 w-2/6 md:w-1/4`}>
                    <span className="font-medium mr-1">{renderWeightAsNumberIntoString(Math.abs(difference))}</span>
                    <Icon datacy="arrow-icon" className="text-xl">{difference === 0 ? "remove" : (difference >= 0 ? "arrow_upward" : "arrow_downward")}</Icon>
                </div>}
                <h5 datacy="item-weight"className={`${selectedItem ? "text-blue-500" : "text-gray-800"} text-right font-bold ${hasDifference ? selectedItem ? "w-2/3 md:w-1/4" : "w-3/6 md:w-1/4" : "w-1/3"} mr-4`} title={`${name} has a weight of ${weightString}`}>{weightString}</h5>
                <div className={`${hasDifference ? "w-1/5 md:w-2/4" : "w-2/3"}`}>
                    {/* TODO (Zoe-Bot): Maybe add little icon with weight at the end when heaviest item */}
                    <ProgressBar progress={percentageProgressbar.percentage} isCa={weight.isCa} progressAdditional={percentageProgressbar.percentageAdditional} />
                </div>
            </div>
        </Link>
    </li >
}