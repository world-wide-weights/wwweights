import BigNumber from "bignumber.js"
import { Weight } from "../../pages/weights"
import { convertWeightIntoTargetUnit } from "./unitConverter"
import { getBestHumanReadableUnit } from "./unitHumanReadable"

/**
 * gets weight and renders it into a human readable string.
 * @param weight the weight to render.
 * @returns string with the weight in the best human readable unit.
 */
export const renderUnitIntoString = (
    weight: Weight
): string => {
    let renderedText = ""

    if (weight.isCa) {
        renderedText += "ca. "
    }

    const bestHumanReadableUnit = getBestHumanReadableUnit(weight.value)

    if (bestHumanReadableUnit.value % 1 !== 0) {
        renderedText += Number(bestHumanReadableUnit.value).toFixed(2)
    } else {
        renderedText += bestHumanReadableUnit.value
    }

    if (weight.additionalValue) {
        const bestHumanReadableUnitAdditionalValue = convertWeightIntoTargetUnit(BigNumber(weight.additionalValue), bestHumanReadableUnit.unit)
        if (bestHumanReadableUnitAdditionalValue.toNumber() % 1 !== 0) {
            renderedText += ` - ${Number(bestHumanReadableUnitAdditionalValue).toFixed(2)}`
        } else {
            renderedText += ` - ${bestHumanReadableUnitAdditionalValue}`
        }
    }

    renderedText += ` ${bestHumanReadableUnit.unit}`

    return renderedText

}