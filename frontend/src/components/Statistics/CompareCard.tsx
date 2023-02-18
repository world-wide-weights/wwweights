import { useState } from "react"
import { calculateWeightFit } from "../../services/utils/weight"
import { Headline } from "../Headline/Headline"
import { Icon } from "../Icon/Icon"

type CompareCardProps = {
    /** Item we want to compare the weight with. */
    type: CompareTypes
    /** Name of the item from where we want to compare. */
    itemName: string
    /** Weight of the item from where we want to compare. */
    weight: number // in g
}

export type CompareTypes = "penny" | "pencil" | "smartphone" | "waterBottle" | "people" | "carTruck" | "airplaneTitanic" | "earths"

export type CompareTypeProps = {
    weight: number // in g
    singular: string
    plural: string
    icon: string
    compareWith?: CompareTypeProps
    iconClassName?: string
}

// TODO: Update naming in component
export const compareTypes: { [key in CompareTypes]: CompareTypeProps } = {
    ["penny"]: {
        weight: 2.5,
        singular: "Penny",
        plural: "Pence",
        icon: "paid",
    },
    ["pencil"]: {
        weight: 16,
        singular: "Pencil",
        plural: "Pencils",
        icon: "edit",
    },
    ["smartphone"]: {
        weight: 150,
        singular: "Smartphone",
        plural: "Smartphones",
        icon: "smartphone",
    },
    ["waterBottle"]: {
        weight: 1_100,
        singular: "Water bottle",
        plural: "Water bottles",
        icon: "water_drop",
    },
    ["people"]: {
        weight: 62_000,
        singular: "Person",
        plural: "People",
        icon: "boy",
        iconClassName: "text-3xl sm:text-5xl -tracking-[20px] sm:-tracking-[30px]"
    },
    ["carTruck"]: {
        weight: 1_400_000,
        singular: "Car",
        plural: "Cars",
        icon: "directions_car",
        compareWith: {
            weight: 2.5e+7,
            singular: "Truck",
            plural: "Trucks",
            icon: "local_shipping",
        },
    },
    ["airplaneTitanic"]: {
        weight: 1e+8,
        singular: "Airplane",
        plural: "Airplanes",
        icon: "flight",
        compareWith: {
            weight: 5.231e+10,
            singular: "Titanic",
            plural: "Titanics",
            icon: "directions_boat",
        },
    },
    ["earths"]: {
        weight: 5.97200000000000062e+27,
        singular: "Earth",
        plural: "Earths",
        icon: "public",
        iconClassName: "text-lg sm:text-2xl tracking-[10px]"
    },
} as const

/**
 * Displays Stats for Compare weights with different items.
 */
export const CompareCard: React.FC<CompareCardProps> = ({ type, itemName, weight }) => {
    // Local States
    const [buttonState, setButtonState] = useState<"left" | "right">("left")

    // Variables
    const compareWith = compareTypes[type].compareWith
    const shouldDisplayToggle = compareWith && calculateWeightFit(weight, compareWith.weight) > 0
    const weightCompare = buttonState === "right" && compareWith ? compareWith.weight : compareTypes[type].weight

    // Calculations
    const count = calculateWeightFit(weight, weightCompare)

    // Don't show component when number to big
    if (count > 1e10)
        return null

    // String
    const countString = parseInt(count.toFixed(0)).toLocaleString()

    return <div className="bg-white rounded-lg pl-4 md:pl-8 py-4 md:py-5">
        {/* Card with icons right and without another compare option */}
        {!shouldDisplayToggle && <div className={`flex items-center justify-between ${type === "people" ? "pr-8 md:pr-10" : "pr-5"}`}>
            {/* Information Text */}
            <div className="mr-2 md:mr-4">
                <Headline level={4} hasMargin={false}>{countString} {count === 1 ? compareTypes[type].singular : compareTypes[type].plural}</Headline>
                <p className="text-gray-700">{`weigh as much as one ${itemName}`}</p>
            </div>

            {/* Icons */}
            <div className="grid grid-cols-10">
                {Array.from({ length: count < 20 ? count : 20 }).map((value, index) => <Icon isFilled datacy="stats-compare-card-icon" className={`${compareTypes[type].iconClassName ?? "text-lg sm:text-2xl"} text-blue-700 ${(index === 0 || index === 10) && count > 20 ? "text-blue-100" : ""} ${(index === 1 || index === 11) && count > 20 ? "text-blue-300" : ""} ${(index === 2 || index === 12) && count > 20 ? "text-blue-500" : ""}`} key={index}>{compareTypes[type].icon}</Icon>)}
            </div>
        </div>}

        {/* Card with icons bottom and with another compare option */}
        {shouldDisplayToggle && <div className="pr-4 md:pr-6">
            <div className="flex items-center justify-between mb-4">
                {/* Information Text */}
                <div>
                    <Headline level={4} hasMargin={false}>{countString} {count === 1 ? (buttonState === "left" ? compareTypes[type].singular : compareWith.singular) : (buttonState === "right" ? compareWith.plural : compareTypes[type].plural)}</Headline>
                    <p className="text-gray-700">{`weigh as much as one ${itemName}`}</p>
                </div>

                {/* Buttons */}
                <div className="flex">
                    <button datacy="stats-compare-card-left" disabled={buttonState === "left"} onClick={() => setButtonState("left")} className={`flex items-center ${buttonState === "left" ? "bg-blue-200 text-blue-600" : "bg-gray-100 text-gray-700"} rounded-tl-lg rounded-bl-lg px-2 py-1`}><Icon isFilled={buttonState === "left"}>{compareTypes[type].icon}</Icon></button>
                    <button datacy="stats-compare-card-right" disabled={buttonState === "right"} onClick={() => setButtonState("right")} className={`flex items-center ${buttonState === "right" ? "bg-blue-200 text-blue-600" : "bg-gray-100 text-gray-700"} rounded-tr-lg rounded-br-lg px-2 py-1`}><Icon isFilled={buttonState === "right"}>{compareWith.icon}</Icon></button>
                </div>
            </div>

            {/* Icons */}
            <div className="grid grid-cols-10 md:w-2/3">
                {Array.from({ length: count < 30 ? count : 30 }).map((value, index) => <Icon isFilled className={`${compareTypes[type].iconClassName ?? "text-lg sm:text-2xl"} text-blue-700 ${index < 10 && count > 30 ? "text-blue-300" : ""} ${index < 20 && count > 20 ? "text-blue-500" : ""}`} key={index}>{buttonState === "left" ? compareTypes[type].icon : compareWith.icon}</Icon>)}
            </div>
        </div>}
    </div>
}