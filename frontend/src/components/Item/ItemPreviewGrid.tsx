import Image from "next/image"
import Link from "next/link"
import { routes } from "../../services/routes/routes"
import { renderUnitIntoString } from "../../services/unit/unitRenderer"
import { Weight } from "../../types/item"
import { Tooltip } from "../Tooltip/Tooltip"

export type ItemPreviewGridProps = {
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
    /** Sets custom background color. */
    bgColor?: string
    /** When true disable link. */
    disableLink?: boolean
}

/**
 * Excerpt component for Item as grid view.
 * @example <ItemPreviewGrid name="Smartphone" slug="smartphone" weight={{ value: 100, isCa: false }} imageUrl="https://via.placeholder.com/96.png" />
 */
export const ItemPreviewGrid: React.FC<ItemPreviewGridProps> = ({ slug, datacy, name, weight, imageUrl, bgColor = "bg-white" }) => {
    const weightString = renderUnitIntoString(weight)

    return <Link datacy={datacy} className={`flex items-center justify-between rounded-lg ${bgColor}  pl-5 pr-2 md:pr-3 py-2 md:py-3`} href={routes.weights.single(slug)}>
        {/* Item name and string */}
        <div className="pr-3">
            <div className="flex flex-col">
                <Tooltip content={name}>
                    <h5 datacy="itempreviewgrid-name" className="text-gray-600 text-sm font-medium w-52 md:w-44 lg:w-24 xl:w-40 2xl:w-28 truncate break-all">{name}</h5>
                </Tooltip>
                <Tooltip content={weightString}>
                    <h5 datacy="itempreviewgrid-weight" className="font-bold w-52 md:w-44 lg:w-24 xl:w-40 2xl:w-28 truncate" title={`${name} has a weight of ${weightString}`}>{weightString}</h5>
                </Tooltip>
            </div>
        </div>

        {/* Image */}
        {imageUrl && <Image datacy="itempreviewgrid-image" priority className="object-cover rounded-lg w-20 bg-white" alt={`Image of ${name}`} src={imageUrl} width={96} height={96} />}
    </Link>
}