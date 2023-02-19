import { Unit, WeightWithUnit } from "../../types/unit"
import { convertWeightIntoUnit } from "./unitConverter"

const valueForEachUnit: { value: number; unit: Unit }[] = [
	{
		value: 1e30,
		unit: "Qg",
	},
	{
		value: 1e27,
		unit: "Rg",
	},
	{
		value: 1e24,
		unit: "Yg",
	},
	{
		value: 1e21,
		unit: "Zg",
	},
	{
		value: 1e18,
		unit: "Eg",
	},
	{
		value: 1e15,
		unit: "Pg",
	},
	{
		value: 1e12,
		unit: "Tg",
	},
	{
		value: 1e6,
		unit: "T",
	},
	{
		value: 1e3,
		unit: "kg",
	},
	{
		value: 1,
		unit: "g",
	},
	{
		value: 1e-3,
		unit: "mg",
	},
	{
		value: 1e-6,
		unit: "µg",
	},
	{
		value: 1e-9,
		unit: "ng",
	},
	{
		value: 1e-12,
		unit: "pg",
	},
	{
		value: 1e-15,
		unit: "fg",
	},
	{
		value: 1e-18,
		unit: "ag",
	},
]

/**
 * Gets value in gram and converts it into best readable Unit 1000g = 1kg.
 * @param weight the weight to convert.
 * @returns object with number and new readable unit.
 */
export const getBestHumanReadableUnit = (weight: number): WeightWithUnit => {
	for (const value of valueForEachUnit) {
		if (weight >= value.value) return convertWeightIntoUnit(weight, "g", value.unit)
	}
	return convertWeightIntoUnit(weight, "g", "g")
}
