import { Weight } from "../../pages/weights"

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
export const generateWeightProgressBarPercentage = (weight: Weight, heaviestWeight: Weight): { percentage: number, percentageAdditional?: number } => {
    const heaviestValue = heaviestWeight.additionalValue ?? heaviestWeight.value
    const value = weight.value
    const valueAdditional = weight.additionalValue ?? undefined
    const percentage = parseFloat((value / heaviestValue * 100).toFixed(2))
    const percentageAdditional = valueAdditional ? parseFloat((valueAdditional / heaviestValue * 100).toFixed(2)) : undefined

    return {
        // When value === heaviestWeight.value --> weight is the heaviest weight
        percentage: value === heaviestWeight.value ? 100 : percentage,
        // Only add percentageAdditional if not undefined
        ...(percentageAdditional ? { percentageAdditional } : {})
    }
}