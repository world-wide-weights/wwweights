import { Weight } from "../../pages/weights"
import { Unit } from "../../types/unit"
import { convertWeightIntoUnit } from "./unitConverter"

/**
 * Gets value in gram and converts it into best readable Unit 1000g = 1kg.
 * @param weight the weight to convert.
 * @returns object with number and new readable unit.
 */
export const getBestHumanReadableUnit = (
  weight: number
): { value: number; unit: Unit } => {
  const weightValueInGram = weight
  if (weightValueInGram >= 1e15)
    return convertWeightIntoUnit(weightValueInGram, "g", "Pg")
  if (weightValueInGram >= 1e12)
    return convertWeightIntoUnit(weightValueInGram, "g", "Tg")
  if (weightValueInGram >= 1e6)
    return convertWeightIntoUnit(weightValueInGram, "g", "Mg")
  if (weightValueInGram >= 1e3)
    return convertWeightIntoUnit(weightValueInGram, "g", "kg")
  if (weightValueInGram >= 1)
    return convertWeightIntoUnit(weightValueInGram, "g", "g")
  if (weightValueInGram >= 1e-3)
    return convertWeightIntoUnit(weightValueInGram, "g", "mg")
  if (weightValueInGram >= 1e-6)
    return convertWeightIntoUnit(weightValueInGram, "g", "µg")
  if (weightValueInGram >= 1e-9)
    return convertWeightIntoUnit(weightValueInGram, "g", "ng")
  return convertWeightIntoUnit(weightValueInGram, "g", "pg")
}
