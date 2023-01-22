import { WeightWithUnit } from "../../types/unit"
import { convertWeightIntoUnit } from "./unitConverter"

/**
 * Gets value in gram and converts it into best readable Unit 1000g = 1kg.
 * @param weight the weight to convert.
 * @returns object with number and new readable unit.
 */
export const getBestHumanReadableUnit = (
  weight: number
): WeightWithUnit => {
  if (weight >= 1e30)
    return convertWeightIntoUnit(weight, "g", "Qg")
  if (weight >= 1e27)
    return convertWeightIntoUnit(weight, "g", "Rg")
  if (weight >= 1e24)
    return convertWeightIntoUnit(weight, "g", "Yg")
  if (weight >= 1e21)
    return convertWeightIntoUnit(weight, "g", "Zg")
  if (weight >= 1e18)
    return convertWeightIntoUnit(weight, "g", "Eg")
  if (weight >= 1e15)
    return convertWeightIntoUnit(weight, "g", "Pg")
  if (weight >= 1e12)
    return convertWeightIntoUnit(weight, "g", "Tg")
  if (weight >= 1e6)
    return convertWeightIntoUnit(weight, "g", "Mg")
  if (weight >= 1e3)
    return convertWeightIntoUnit(weight, "g", "kg")
  if (weight >= 1)
    return convertWeightIntoUnit(weight, "g", "g")
  if (weight >= 1e-3)
    return convertWeightIntoUnit(weight, "g", "mg")
  if (weight >= 1e-6)
    return convertWeightIntoUnit(weight, "g", "µg")
  if (weight >= 1e-9)
    return convertWeightIntoUnit(weight, "g", "ng")
  if (weight >= 1e-12)
    return convertWeightIntoUnit(weight, "g", "pg")
  if (weight >= 1e-15)
    return convertWeightIntoUnit(weight, "g", "fg")
  return convertWeightIntoUnit(weight, "g", "ag")
}
