import { compareTypes, StatsCompareCard } from "../Statistics/StatsCompareCard"

type SingleWeightCompareProps = {
    compareWeight: number
    itemName: string
}

export const SingleWeightCompare: React.FC<SingleWeightCompareProps> = ({ compareWeight, itemName }) => {
    return <div className="lg:w-1/2">
        {compareWeight > compareTypes["carVehicle"].weight && <StatsCompareCard type="carVehicle" weight={compareWeight} itemName={itemName} />}
        {compareWeight > compareTypes["earths"].weight && <StatsCompareCard type="earths" weight={compareWeight} itemName={itemName} />}
        {compareWeight > compareTypes["people"].weight && <StatsCompareCard type="people" weight={compareWeight} itemName={itemName} />}
        {compareWeight > compareTypes["titanicAirplane"].weight && <StatsCompareCard type="titanicAirplane" weight={compareWeight} itemName={itemName} />}
        <StatsCompareCard type="water_bottle" weight={compareWeight} itemName={itemName} />
    </div>
}