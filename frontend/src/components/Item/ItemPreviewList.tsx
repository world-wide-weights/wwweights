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
 * <ItemPreviewList name="Smartphone" slug="smartphone" weight="300 g" tags={["tag1", "tag2", "tag3"]} imageUrl="https://via.placeholder.com/96.png" />
 * ```
 */
export const ItemPreviewList: React.FC<ItemPreviewProps> = ({ slug, name, tags, weight, imageUrl }) => {
    return <li>
        <Link className="flex items-center h-12" href={routes.weights.single(slug)}>
            <div className="min-w-min">
                {imageUrl && <Image className="object-cover rounded-lg w-12 h-12 mr-8 lg:mr-12 bg-white" alt={`Image of ${name}`} src={imageUrl} width={96} height={96} />}
            </div>
            <div className="lg:flex w-8/12 md:w-5/12 lg:w-10/12">
                <h5 className="text-gray-600 truncate md:mr-4 w-9/12 md:w-7/12">{name}</h5>
                <h5 className="text-gray-800 text-lg font-semibold md:w-4/12" title={`${name} has a weight of ${weight}`}>{weight}</h5>
            </div>
            <span className="text-gray-600 hidden md:block w-5/12">{tags.slice(0, 5).map((tag, index) => index !== tags.length - 1 ? `${tag}, ` : `${tag}`)}</span>
            <Button className="hidden sm:flex w-4/12 md:w-3/12" icon="arrow_forward" isColored kind="tertiary">Show details</Button>
        </Link>
    </li>
}