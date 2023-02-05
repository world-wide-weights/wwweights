import BigNumber from "bignumber.js"
import { Weight } from "../../types/item"
import { convertWeightIntoTargetUnit } from "./unitConverter"
import { getBestHumanReadableUnit } from "./unitHumanReadable"

/**
 * Gets number and formats it to a number with seperation points.
 * @param number the number to format.
 * @param formatComma if true, the number will be formatted without seperation points because it has a comma .
 * @returns string with formated number.
 */
export const addPointsToNumber = (number: number, formatComma: boolean): string => {
    if (formatComma) {
        return number.toFixed(2)
    } else {
        return new Intl.NumberFormat("de-DE").format(number)
    }
}

/**
 * Gets weight and renders it into a human readable string.
 * @param weight the weight to render.
 * @returns string with the weight in the best human readable unit.
 */
export const renderUnitIntoString = (weight: Weight): string => {
    let renderedText = ""

    //Add ca. to String if weight isCa = true.
    if (weight.isCa) {
        renderedText += "ca. "
    }

    const bestHumanReadableUnit = getBestHumanReadableUnit(weight.value)

    //Add weight value to String, if large number it will add Seperation Points.
    if (bestHumanReadableUnit.value % 1 !== 0) {
        renderedText += addPointsToNumber(bestHumanReadableUnit.value, true)
    } else {
        renderedText += addPointsToNumber(bestHumanReadableUnit.value, false)
    }

    //Add additional value to String if != empty, if large number it will add Seperation Points.
    if (weight.additionalValue) {
        const bestHumanReadableUnitAdditionalValue = convertWeightIntoTargetUnit(BigNumber(weight.additionalValue), bestHumanReadableUnit.unit)
        if (bestHumanReadableUnitAdditionalValue % 1 !== 0) {
            renderedText += ` - ${addPointsToNumber(bestHumanReadableUnitAdditionalValue, true)}`
        } else {
            renderedText += ` - ${addPointsToNumber(bestHumanReadableUnitAdditionalValue, false)}`
        }
    }

    //Add weight unit to String.
    renderedText += ` ${bestHumanReadableUnit.unit}`

    return renderedText

}

/**
 * Gets weight as number and renders it into a human readable string.
 * @param weight the weight as number to render.
 * @returns string with the weight in the best human readable unit.
 */
export const renderWeightAsNumberIntoString = (weight: number): string => {
    let renderedText = ""

    const bestHumanReadableUnit = getBestHumanReadableUnit(weight)

    //Add weight value to String, if large number it will add Seperation Points.
    if (bestHumanReadableUnit.value % 1 !== 0) {
        renderedText += addPointsToNumber(bestHumanReadableUnit.value, true)
    } else {
        renderedText += addPointsToNumber(bestHumanReadableUnit.value, false)
    }

    //Add weight unit to String.
    renderedText += ` ${bestHumanReadableUnit.unit}`

    return renderedText

}