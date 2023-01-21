import BigNumber from "bignumber.js"
import { Weight } from "../../pages/weights"
import { convertWeightIntoTargetUnit } from "./unitConverter"
import { getBestHumanReadableUnit } from "./unitHumanReadable"


export const addPointsToNumber = (number: number, formatComma: boolean): string => {
    if(formatComma){
        return number.toFixed(2)
    }else{
        return new Intl.NumberFormat().format(number)
    }
    
}
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
        renderedText += addPointsToNumber(bestHumanReadableUnit.value, true)
    } else {
        renderedText += addPointsToNumber(bestHumanReadableUnit.value, false)
    }

    if (weight.additionalValue) {
        const bestHumanReadableUnitAdditionalValue = convertWeightIntoTargetUnit(BigNumber(weight.additionalValue), bestHumanReadableUnit.unit)
        if (bestHumanReadableUnitAdditionalValue.toNumber() % 1 !== 0) {
            renderedText += ` - ${addPointsToNumber(bestHumanReadableUnitAdditionalValue.toNumber(), true)}`
        } else {
            renderedText += ` - ${addPointsToNumber(bestHumanReadableUnitAdditionalValue.toNumber(), false)}`
        }
    }

    renderedText += ` ${bestHumanReadableUnit.unit}`

    return renderedText

}