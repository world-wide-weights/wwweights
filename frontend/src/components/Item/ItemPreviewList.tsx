import Image from "next/image"
import Link from "next/link"
import { routes } from "../../services/routes/routes"
import { Button } from "../Button/Button"

export type ItemPreviewProps = {
    /** Name of item */
    name: string
    /** Weight */
    weight: string
    /** Slug of item */
    slug: string
    /** Tags of item  */
    tags: string[]
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
export const ItemPreviewList: React.FC<ItemPreviewProps> = ({ slug, name, tags, weight, imageUrl }) => {
    return <li>
        <Link className="flex items-center h-12" href={routes.weights.single(slug)}>
            <div className="w-[7%]">
                {imageUrl && <Image className="object-cover rounded-lg w-12 h-12 mr-5 bg-white" alt={`Image of ${name}`} src={imageUrl} width={96} height={96} />}
            </div>
            <h5 className="text-gray-600 truncate mr-4 w-3/12">{name}</h5>
            <h5 className="text-gray-800 text-lg font-semibold w-2/12" title={`${name} has a weight of ${weight}`}>{weight}</h5>
            <span className="text-gray-600 w-4/12">{tags.map((tag, index) => index !== tags.length - 1 ? `${tag}, ` : `${tag}`)}</span>
            <Button className="w-2/12" icon="arrow_forward" isColored kind="tertiary">Show details</Button>
        </Link>
    </li>
}