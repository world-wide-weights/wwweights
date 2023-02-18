import { generateSourceString } from "../../services/utils/generateSourceString"

export type ItemSourceProps = {
    /** The name of the item. */
    name: string
    /** The weight string (with ca and range) of the item. */
    weightString: string
    /** The source of the item. */
    source: string
}

/**
 * Renders the source of an item.
 */
export const ItemSource: React.FC<ItemSourceProps> = ({ name, source, weightString }) => {
    const { sourceString, isUrl } = generateSourceString({ name, weightString, source })

    return isUrl ?
        <a target="_blank" rel="noopener noreferrer" href={source} className="text-gray-600 hover:text-gray-700 mb-3 md:mb-5">{sourceString}</a>
        : <p className="text-gray-600 mb-3 md:mb-5">{sourceString}</p>
}