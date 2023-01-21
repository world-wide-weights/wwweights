import { Headline } from "../Headline/Headline"
import { Icon } from "../Icon/Icon"

type StatsCompareCardProps = {
    type: CompareTypes
    itemName?: string
    count: number
    hasCompareButtons?: string
}

export type CompareTypes = "water_bottle" | "people" | "cars" | "titanics" | "earths"

export const compareTypes: { [key in CompareTypes]: {
    singular: string,
    plural: string,
    icon: string,
    iconClassName?: string
} } = {
    ["water_bottle"]: {
        singular: "Water bottle",
        plural: "Water bottles",
        icon: "pediatrics",
    },
    ["people"]: {
        singular: "People",
        plural: "Peoples",
        icon: "boy",
        iconClassName: "text-5xl -tracking-[35px]"
    },
    ["cars"]: {
        singular: "Car",
        plural: "Cars",
        icon: "directions_car",
    },
    ["titanics"]: {
        singular: "Titanic",
        plural: "Titanics",
        icon: "directions_boat",
    },
    ["earths"]: {
        singular: "Earth",
        plural: "Earths",
        icon: "public",
    },
}

/**
 * Displays Stats for Compare Weights with different items.
 */
export const StatsCompareCard: React.FC<StatsCompareCardProps> = ({ type, itemName, count, hasCompareButtons = false }) => {
    return <div className="flex items-center justify-between bg-white rounded-lg pl-4 md:pl-8 pr-8 md:pr-10 py-3 md:py-5 mb-2 md:mb-4">
        {!hasCompareButtons && <>
            <div className="mr-4">
                <Headline level={4} hasMargin={false}>{count} {count === 1 ? compareTypes[type].singular : compareTypes[type].plural}</Headline>
                <p className="text-gray-700">are needed to lift up {itemName}.</p>
            </div>

            <div className="grid grid-cols-10">
                {Array.from({ length: count < 20 ? count : 20 }).map((value, index) => <Icon className={`${compareTypes[type].iconClassName ?? ""} text-blue-700 ${(index === 0 || index === 10) && count > 20 ? "text-blue-100" : ""} ${(index === 1 || index === 11) && count > 20 ? "text-blue-300" : ""} ${(index === 2 || index === 12) && count > 20 ? "text-blue-500" : ""}`} key={index}>{compareTypes[type].icon}</Icon>)}
            </div>
        </>}
        {hasCompareButtons && <>
            <div className="flex items-center justify-between">
                <div>
                    <Headline level={4} hasMargin={false}>25 Cars</Headline>
                    <p className="text-gray-700">weigh as much as one {itemName}.</p>
                </div>

                <div className="flex">
                    <button className="flex items-center bg-gray-300 rounded-tl-lg rounded-bl-lg px-2 py-1"><Icon className="text-gray-700">local_shipping</Icon></button>
                    <button className="flex items-center bg-blue-300 rounded-tr-lg rounded-br-lg px-2 py-1"><Icon className="text-blue-600">directions_car</Icon></button>
                </div>
            </div>
            <div>
                {Array.from({ length: 15 }).map((value, index) => <Icon className={`text-5xl text-blue-700 -tracking-[35px] ${index < 3 ? "text-blue-500" : ""} ${index < 2 ? "text-blue-300" : ""} ${index < 1 ? "text-blue-100" : ""}`} key={index}>{compareTypes[type].icon}</Icon>)}
            </div>
        </>}
    </div>
}