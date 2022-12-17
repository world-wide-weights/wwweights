import Image from "next/image"
import Link from "next/link"
import { Weight } from "../../pages/weights"
import { routes } from "../../services/routes/routes"
import { ProgressBar } from "../ProgressBar/ProgressBar"

export type ItemPreviewProps = {
    /** Name of item */
    name: string
    /** Weight */
    weight: Weight
    /** Slug of item */
    slug: string
    /** Image URL */
    imageUrl?: string
    /** For testing */
    datacy?: string
}

/**
 * Excerpt component for Item
 * 
 * Example:
 * ```tsx
 * <ItemPreviewList name="Smartphone" slug="smartphone" weight="300 g" imageUrl="https://via.placeholder.com/96.png" />
 * ```
 */
export const ItemPreviewList: React.FC<ItemPreviewProps> = ({ slug, name, weight, imageUrl }) => {
    const weightString = `${weight.isCa ? "ca." : ""}${weight.value}${weight.aditionalValue ? `- ${weight.aditionalValue}` : ""} g`

    return <li className="bg-white rounded-lg py-2 mb-2">
        <Link className="flex flex-col md:flex-row md:items-center md:h-12 mx-4 md:mx-8" href={routes.weights.single(slug)}>
            <div className="flex justify-between items-center h-12 md:w-1/4">
                <h5 className="text-gray-600 truncate pr-3">{name}</h5>
                <div className="min-w-[48px] w-[48px]">
                    {imageUrl && <Image className="object-cover rounded-lg w-12 h-12 md:mr-5" alt={`Image of ${name}`} src={imageUrl} width={96} height={96} />}
                </div>
            </div>
            <div className="flex items-center md:w-3/4">
                <h5 className="text-gray-800 md:text-lg text-right font-semibold w-1/3 sm:w-1/4 lg:w-1/6 mr-4" title={`${name} has a weight of ${weightString}`}>{weightString}</h5>
                <div className="w-2/3 sm:w-3/4 lg:w-5/6">
                    {/* TODO (Zoe-Bot): Add correct percentage and find a solution for span Issue #107 */}
                    <ProgressBar progress={62} />
                </div>
            </div>
        </Link>
    </li>
}