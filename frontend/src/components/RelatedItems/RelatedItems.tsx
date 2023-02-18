import { getImageUrl } from "../../services/utils/getImageUrl"
import { getSortedItemsAndHeaviest } from "../../services/utils/weight"
import { Item } from "../../types/item"
import { Headline } from "../Headline/Headline"
import { ItemPreviewList } from "../Item/ItemPreviewList"

type RelatedItemsProps = {
    /** Specify weight in gram of item. */
    item: Item
    /** Specify name of item. */
    relatedItems: Item[]
}

/**
 * Display list of related items with one item highlighted.
 * @example <RelatedItems item={item} relatedItems={relatedItems} />
 */
export const RelatedItems: React.FC<RelatedItemsProps> = ({ relatedItems, item }) => {
    const { items, heaviestWeight } = getSortedItemsAndHeaviest([...relatedItems, item], "desc")

    return <>
        {/* Headline */}
        <Headline level={4}>Related Items</Headline>

        {/* Items */}
        <ul className="mb-5 md:mb-10">
            {items.map(relatedItem => {
                const currentItem = relatedItem.name === item.name
                const difference = relatedItem.weight.value - item.weight.value

                return <ItemPreviewList datacy={`related-items-item${currentItem ? "-" + "current" : ""}`} key={relatedItem.slug} selectedItem={currentItem} disableLink={currentItem} difference={difference} {...relatedItem} heaviestWeight={heaviestWeight} imageUrl={getImageUrl(relatedItem.image)} />
            })}
        </ul>
    </>
}