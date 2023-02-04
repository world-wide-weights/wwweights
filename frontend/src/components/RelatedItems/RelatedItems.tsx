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
 */
export const RelatedItems: React.FC<RelatedItemsProps> = ({ relatedItems, item }) => {
    const relatedItemsWithItemSortedDesc = [...relatedItems, item].sort((a, b) => b.weight.value - a.weight.value)
    const heaviestWeight = relatedItemsWithItemSortedDesc[relatedItemsWithItemSortedDesc.length - 1].weight

    return <>
        <Headline level={4}>Related Items</Headline>
        <ul className="mb-5 md:mb-10">
            {relatedItemsWithItemSortedDesc.map(relatedItem => {
                const currentItem = relatedItem.name === item.name
                const difference = relatedItem.weight.value - item.weight.value

                return <ItemPreviewList datacy={`related-items-item${currentItem ? "-" + "current" : ""}`} key={relatedItem.slug} selectedItem={currentItem} disableLink={currentItem} difference={difference} {...relatedItem} heaviestWeight={heaviestWeight} imageUrl={relatedItem.image} />
            })}
        </ul>
    </>
}