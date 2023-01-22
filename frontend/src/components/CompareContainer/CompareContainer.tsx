import BigNumber from "bignumber.js"
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
    return <div className="lg:w-1/2">
        {Object.entries(compareTypes).map(([type, compareType]) => {
            const weightCompare = new BigNumber(weight).comparedTo(new BigNumber(compareType.weight))
            // 1: greater | 0: same value
            return (weightCompare === 1 || weightCompare === 0) && <CompareCard type={type as CompareTypes} weight={weight} itemName={itemName} />
        })}
    </div>
}