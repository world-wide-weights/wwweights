import { compareTypes, StatsCompareCard } from "../Statistics/StatsCompareCard"

type SingleWeightCompareProps = {
    weight: number
    itemName: string
}

export const SingleWeightCompare: React.FC<SingleWeightCompareProps> = ({ weight, itemName }) => {
    return <div className="lg:w-1/2">
        {weight > compareTypes["carVehicle"].weight && <StatsCompareCard type="carVehicle" weight={weight} itemName={itemName} />}
        {weight >= compareTypes["earths"].weight && <StatsCompareCard type="earths" weight={weight} itemName={itemName} />}
        {weight > compareTypes["people"].weight && <StatsCompareCard type="people" weight={weight} itemName={itemName} />}
        {weight > compareTypes["titanicAirplane"].compareWith!.weight && <StatsCompareCard type="titanicAirplane" weight={weight} itemName={itemName} />}
        <StatsCompareCard type="water_bottle" weight={weight} itemName={itemName} />
    </div>
}