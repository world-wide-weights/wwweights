import Image from "next/image"
import Link from "next/link"
import { Weight } from "../../pages/weights"
import { routes } from "../../services/routes/routes"
import { generateWeightProgressBarPercentage, generateWeightString } from "../../services/utils/weight"
import { ProgressBar } from "../ProgressBar/ProgressBar"

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
}

/**
 * Excerpt component for Item
 * 
 * Example:
 * ```tsx
 * <ItemPreviewList name="Smartphone" slug="smartphone" weight={ value: 100, isCa: false } heaviestWeight={ value: 100, isCa: false } imageUrl="https://via.placeholder.com/96.png" />
 * ```
 */
export const ItemPreviewList: React.FC<ItemPreviewProps & { heaviestWeight: Weight }> = ({ slug, name, weight, heaviestWeight, imageUrl, datacy }) => {
    const weightString = generateWeightString(weight)
    const percentageProgressbar = generateWeightProgressBarPercentage(weight, heaviestWeight)

    return <li className="bg-white rounded-lg py-2 mb-2">
        <Link datacy={datacy} className="flex flex-col md:flex-row md:items-center md:h-12 mx-2 md:mx-4" href={routes.weights.single(slug)}>
            <div className="flex justify-between items-center h-12 md:w-1/3">
                <h5 className="text-gray-600 font-medium truncate pr-3">{name}</h5>
                <div className="min-w-[48px] w-[48px]">
                    {imageUrl && <Image className="object-cover rounded-lg w-12 h-12 md:mr-5" alt={`Image of ${name}`} src={imageUrl} width={96} height={96} />}
                </div>
            </div>
            <div className="flex items-center md:w-2/3">
                <h5 className="text-gray-800 text-right font-bold w-1/3 sm:w-1/4 lg:w-1/3 mr-4" title={`${name} has a weight of ${weightString}`}>{weightString}</h5>
                <div className="w-2/3 sm:w-3/4 lg:w-2/3">
                    {/* TODO (Zoe-Bot): Maybe add little icon with weight at the end when heaviest item */}
                    <ProgressBar progress={percentageProgressbar.percentage} isCa={weight.isCa} progressAdditional={percentageProgressbar.percentageAdditional} />
                </div>
            </div>
        </Link>
    </li>
}