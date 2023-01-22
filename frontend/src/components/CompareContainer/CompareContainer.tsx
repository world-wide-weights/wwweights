import BigNumber from "bignumber.js"
import { Headline } from "../Headline/Headline"
import { CompareCard, CompareTypes, compareTypes } from "../Statistics/CompareCard"

type CompareContainerProps = {
    /** Specify weight in gram of item. */
    weight: number
    /** Specify name of item. */
    itemName: string
}

/**
 * Displays CompareCards based on given weight.
 */
export const CompareContainer: React.FC<CompareContainerProps> = ({ weight, itemName }) => {
    return <div className="flex flex-col gap-2 md:gap-4 lg:w-1/2">
        <Headline level={4} hasMargin={false}>Compare Items</Headline>
        {Object.entries(compareTypes).map(([type, compareType]) => {
            const weightCompare = new BigNumber(weight).comparedTo(new BigNumber(compareType.weight))
            // 1: greater | 0: same value
            return (weightCompare === 1 || weightCompare === 0) && <CompareCard type={type as CompareTypes} weight={weight} itemName={itemName} />
        })}

    </div>
}