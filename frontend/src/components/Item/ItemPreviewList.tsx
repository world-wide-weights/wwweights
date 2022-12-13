import Image from "next/image"
import Link from "next/link"
import { routes } from "../../services/routes/routes"

export type ItemPreviewProps = {
    /** Name of weight */
    name: string
    /** Weight */
    weight: string
    /** Slug of weight */
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
export const ItemPreview: React.FC<ItemPreviewProps> = ({ slug, datacy, name, weight, imageUrl }) => {
    return <Link datacy={datacy} className="flex items-center" href={routes.weights.single(slug)}>
        {imageUrl && <Image className="object-cover rounded-xl w-24 h-24 mr-5 bg-white" alt={`Image of ${name}`} src={imageUrl} width={96} height={96} />}
        <div>
            <h5 className="text-gray-900 text-xl font-semibold break-all">{name}</h5>
            <p title={`${name} has a weight of ${weight}`}>{weight}</p>
        </div>
    </Link>
}