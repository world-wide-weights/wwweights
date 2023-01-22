import { Item } from "../../pages/weights"
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
    const relatedItemsWithItemSorted = [...relatedItems, item].sort((a, b) => a.weight.value - b.weight.value)
    const heaviestWeight = relatedItemsWithItemSorted[relatedItemsWithItemSorted.length - 1].weight

    return <>
        <Headline level={4}>Related Items</Headline>
        <ul className="mb-5 md:mb-10">
            {relatedItemsWithItemSorted.map(relatedItem => {
                const currentItem = relatedItem.name === item.name
                const difference = relatedItem.weight.value - item.weight.value

                return <ItemPreviewList datacy={`related-items-item${currentItem ? "-" + "current" : ""}`} key={relatedItem.id} selectedItem={currentItem} disableLink={currentItem} difference={difference} {...relatedItem} heaviestWeight={heaviestWeight} imageUrl="https://picsum.photos/200" />
            })}
        </ul>
    </>
}