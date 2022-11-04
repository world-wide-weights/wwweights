import Image from "next/image"

export type ItemPreviewProps = {
    /** Name of weight */
    name: string
    /** Weight */
    weight: string
    /** Identification to weigth */
    id: string
    /** Image URL */
    imageUrl?: string
}

/**
 * Excerpt component for Item
 * 
 * Example:
 * ```tsx
 * <ItemPreview id="1" name="Smartphone" weight="300 gr" imageUrl="https://via.placeholder.com/96.png" />
 * ```
 */
export const ItemPreview: React.FC<ItemPreviewProps> = ({ id, name, weight, imageUrl }) => {

    // TODO: Move this to route defintion constant
    return <a className="flex items-center" href={`/weights/${id}`}>
        {imageUrl && <Image className="object-cover rounded-xl w-24 h-24 mr-5 bg-white" alt={`Image of ${name}`} src={imageUrl} width={96} height={96} />}
        <div>
            <h5 className="text-gray-900 text-xl font-semibold">{name}</h5>
            <p title={`${name} has a weight of ${weight}`}>{weight}</p>
        </div>
    </a >
}