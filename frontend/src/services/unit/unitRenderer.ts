import { Weight } from "../../pages/weights"
import { convertWeightIntoTargetUnit } from "./unitConverter"
import { getBestHumanReadableUnit } from "./unitHumanReadable"
import BigNumber from "bignumber.js"

/**
 * Gets value in gram and converts it into best readable Unit 1000g = 1kg.
 * @param weight the weight to convert.
 * @returns object with number and new readable unit.
 */
export const renderUnitIntoString = (
    weight: Weight
): string => {
    const bestHumanReadableUnit = getBestHumanReadableUnit(weight.value)
    let renderedText = ""

    if(weight.isCa){
        renderedText += "ca. "
    }

    if(bestHumanReadableUnit.value % 1 !== 0){
        renderedText += Number(bestHumanReadableUnit.value).toFixed(2)
    }else{
        renderedText += bestHumanReadableUnit.value
    }
    
    if(weight.additionalValue){
        const bestHumanReadableUnitAdditionalValue = convertWeightIntoTargetUnit(BigNumber(weight.additionalValue), bestHumanReadableUnit.unit)
        if(bestHumanReadableUnitAdditionalValue.toNumber() % 1 !== 0){
            renderedText += ` - ${Number(bestHumanReadableUnitAdditionalValue).toFixed(2)}`
        }else{
        renderedText += ` - ${bestHumanReadableUnitAdditionalValue}`
        }
    }

    renderedText += ` ${bestHumanReadableUnit.unit}`

  return renderedText
  
}