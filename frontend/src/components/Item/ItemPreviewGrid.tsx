import Image from "next/image"
import Link from "next/link"
import { routes } from "../../services/routes/routes"
import { generateWeightString } from "../../services/utils/weight"
import { ItemPreviewProps } from "./ItemPreviewList"

/**
 * Excerpt component for Item
 * s
 * Example:
 * ```tsx
 * <ItemPreviewGrid id="1" name="Smartphone" weight="300 gr" imageUrl="https://via.placeholder.com/96.png" />
 * ```
 */
export const ItemPreviewGrid: React.FC<ItemPreviewProps> = ({ slug, datacy, name, weight, imageUrl }) => {
    const weightString = generateWeightString(weight)

    return <Link datacy={datacy} className="flex items-center justify-between rounded-lg bg-white pl-5 pr-2 md:pr-3 py-2 md:py-3" href={routes.weights.single(slug)}>
        <div className="pr-3">
            <div>
                <h5 className="text-gray-600 font-medium break-all">{name}</h5>
                <h5 className="font-bold text-lg" title={`${name} has a weight of ${weightString}`}>{weightString}</h5>
            </div>
        </div>
        {imageUrl && <Image priority className="object-cover rounded-lg w-20 bg-white" alt={`Image of ${name}`} src={imageUrl} width={96} height={96} />}
    </Link>
}