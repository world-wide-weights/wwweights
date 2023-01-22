import { CompareTypes, compareTypes, StatsCompareCard } from "../Statistics/StatsCompareCard"

type SingleWeightCompareProps = {
    weight: number
    itemName: string
}

export const SingleWeightCompare: React.FC<SingleWeightCompareProps> = ({ weight, itemName }) => {
    return <div className="lg:w-1/2">
        {Object.entries(compareTypes).map(([type, compareType]) => {
            if (weight > compareType.weight)
                return <StatsCompareCard type={type as CompareTypes} weight={weight} itemName={itemName} />
        })}
    </div>
}