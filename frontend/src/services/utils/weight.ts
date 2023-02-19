import { Item, Weight } from "../../types/item"

/**
 * Generates the string for showing the weight with ca and range support.
 * @param weight the weight we want to generate the string for
 * @returns the generated string with ca and range support.
 */
export const generateWeightString = (weight: Weight): string => {
	return `${weight.isCa ? "ca. " : ""}${weight.value}${weight.additionalValue ? `-${weight.additionalValue}` : ""} g`
}

/**
 * Generates an object which can be used for the progress bar percentage which shows the relation from weight and heaviest weight.
 * @param weight the weight from where want to get the percentage
 * @param heaviestWeight the heaviest weight from the search, tag or overall
 * @returns an object with the percentage calculated and an additional percentage to show range if exist
 */
export const generateWeightProgressBarPercentage = (weight: Weight, heaviestWeight: Weight): { percentage: number; percentageAdditional?: number } => {
	// Get the heaviest value from heaviestWeight, ensure that additionalValue is bigger than value
	const heaviestValue = heaviestWeight.additionalValue !== undefined ? Math.max(heaviestWeight.value, heaviestWeight.additionalValue) : heaviestWeight.value
	const { value, additionalValue } = weight
	const percentage = parseFloat(((value / heaviestValue) * 100).toFixed(2))
	const percentageAdditional = additionalValue ? parseFloat(((additionalValue / heaviestValue) * 100).toFixed(2)) : undefined

	return {
		percentage,
		// Only add percentageAdditional if not undefined
		...(percentageAdditional ? { percentageAdditional } : {}),
	}
}

/**
 * Calculates median from additional value and value.
 * @param weight we want to get median from.
 * @returns the median from additional value and value.
 */
export const calculateMedianWeight = (weight: Weight): number => {
	if (!weight.additionalValue) return weight.value

	const difference = weight.additionalValue - weight.value
	const differenceHalfRounded = Math.floor(difference / 2)
	return weight.value + differenceHalfRounded
}

/**
 * Calculate how often a weight fits into the compare weight and rounds up.
 * @param weight the weight we want to know how often it fits in compareWeight.
 * @param compareWeight the reference weight.
 * @returns the count how often weight fits in compareWeight.
 */
export const calculateWeightFit = (weight: number, compareWeight: number): number => {
	if (weight === 0) return 0
	const fitCount = weight / compareWeight
	const fitCountRounded = Math.round(fitCount)
	return fitCountRounded
}

/**
 * This function sorts an array of items based on their weight in either ascending or descending order, and returns the sorted items and the heaviest weight in the array.
 * @param items The array of items to be sorted and analyzed.
 * @param sortDirection The desired sorting direction, either "asc" for ascending or "desc" for descending.
 * @returns An object containing the sorted items and the heaviest weight in the array.
 *  - items: The sorted array of items.
 *  - heaviestWeight: The weight object of the heaviest item in the array.
 */
export const getSortedItemsAndHeaviest = (items: Item[], sortDirection: "asc" | "desc" = "asc"): { items: Item[]; heaviestWeight: Weight } => {
	// Sort descending
	if (sortDirection === "desc")
		return {
			items: items.sort((a, b) => b.weight.value - a.weight.value),
			heaviestWeight: items[0].weight,
		}

	// Sort ascending
	return {
		items: items.sort((a, b) => a.weight.value - b.weight.value),
		heaviestWeight: items[items.length - 1].weight,
	}
}
