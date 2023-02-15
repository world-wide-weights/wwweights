import Image from "next/image"
import Link from "next/link"
import { routes } from "../../services/routes/routes"
import { renderUnitIntoString } from "../../services/unit/unitRenderer"
import { getImageUrl } from "../../services/utils/getImageUrl"
import { Weight } from "../../types/item"
import { IconButton } from "../Button/IconButton"
import { Tooltip } from "../Tooltip/Tooltip"

type ItemListContributeProps = {
    /** Name of item. */
    name: string
    /** Slug of item. */
    slug: string
    /** Weight of item. */
    weight: Weight
    /** Image of item. */
    image?: string
}

export const ItemListContribute: React.FC<ItemListContributeProps> = ({ name, slug, weight, image }) => {
    const weightString = renderUnitIntoString(weight)

    const imageUrl = getImageUrl(image)

    return <li datacy="item-list-contribute" className="bg-white rounded-lg py-4 px-2 md:py-2 mb-2">
        <div className="flex justify-between">
            {/* Item name, weight and image */}
            <Link className="flex justify-between md:justify-start items-center w-full md:h-12 mx-2 md:mx-4" href={routes.weights.single(slug)}>
                <div className="md:flex">
                    <Tooltip position="left" content={name}>
                        <h5 datacy="item-name" className="font-medium truncate w-40 md:w-64 pr-3">{name}</h5>
                    </Tooltip>
                    <h5 datacy="item-weight" className="text-gray-600 font-medium md:w-32 mr-5">{weightString}</h5>
                </div>
                {imageUrl && <Image datacy="item-image" className="object-cover rounded-lg w-12 h-12" alt={`Image of ${name}`} src={imageUrl} width={96} height={96} />}
            </Link>

            {/* Actions */}
            <div className="flex items-center mx-0 sm:mx-3">
                <Tooltip content="Edit">
                    <IconButton datacy="edit-action" icon="edit" />
                </Tooltip>
                <Tooltip content="Delete">
                    <IconButton datacy="delete-action" icon="close" />
                </Tooltip>
            </div>
        </div>
    </li>
}