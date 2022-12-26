import Image from "next/image"
import Link from "next/link"
import { Weight } from "../../pages/weights"
import { routes } from "../../services/routes/routes"
import { generateWeightString } from "../../services/utils/weight"

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
 * <ItemPreviewBox id="1" name="Smartphone" weight="300 gr" imageUrl="https://via.placeholder.com/96.png" />
 * ```
 */
export const ItemPreviewBox: React.FC<ItemPreviewProps> = ({ slug, datacy, name, weight, imageUrl }) => {
    const weightString = generateWeightString(weight)

    return <Link datacy={datacy} className="flex items-center" href={routes.weights.single(slug)}>
        {imageUrl && <Image priority className="object-cover rounded-xl w-24 h-24 mr-5 bg-white" alt={`Image of ${name}`} src={imageUrl} width={96} height={96} />}
        <div>
            <h5 className="text-gray-900 text-xl font-medium break-all">{name}</h5>
            <p title={`${name} has a weight of ${weightString}`}>{weightString}</p>
        </div>
    </Link>
}