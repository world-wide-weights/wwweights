import BigNumber from "bignumber.js"
import { Unit } from "../../types/unit"

/**
 * The number of comma shifts for each unit.
 */
const commaShiftsForUnit: { [K in Unit]: number } = {
  pg: -12,
  ng: -9,
  µg: -6,
  mg: -3,
  g: 0,
  kg: 3,
  t: 6,
  Mt: 12,
  Gt: 15,
}

// FOR FUTURE WORK, see: https://en.wikipedia.org/wiki/Orders_of_magnitude_(mass)

/**
 * Shifts the comma in a given number.
 * @param value the number where the comma shift should be applied.
 * @param unit the number of how many comma shifts it should make.
 * @param left in which direction the comma should be shifted.
 * @returns the number with the given comma shift.
 */
export const calculateCommaShift = (
  value: BigNumber,
  unit: number,
  left: Boolean
): BigNumber => {
  if (left) {
    return value.multipliedBy(BigNumber(10).exponentiatedBy(unit))
  } else {
    return value.multipliedBy(BigNumber(10).exponentiatedBy(-unit))
  }
}

/**
 * Converts given Weight in any unit into gram.
 * @param value the value of the weight in any unit.
 * @param unit the unit of the value.
 * @returns the value in gram.
 */
export const convertAnyWeightIntoGram = (
  value: BigNumber,
  unit: Unit
): BigNumber => {
  return calculateCommaShift(value, commaShiftsForUnit[unit], true)
}

/**
 * Converts given Weight in gram into other weight unit.
 * @param value the value of the weight in gram.
 * @param targetUnit the target unit of the value.
 * @returns the value in the given target Unit.
 */
export const convertWeightIntoTargetUnit = (
  value: BigNumber,
  targetUnit: Unit
): BigNumber => {
  return calculateCommaShift(value, commaShiftsForUnit[targetUnit], false)
}

/**
 * Converts given Weight with any unit into other weight unit.
 * @param value the value of the weight in the current unit.
 * @param unit the current unit the value has.
 * @param targetUnit the unit we want to have.
 * @returns object with the value in the given target Unit.
 */
export const convertWeightIntoUnit = (
  value: number,
  unit: Unit,
  targetUnit: Unit
): { value: number; unit: Unit } => {
  const weightInGramm = convertAnyWeightIntoGram(new BigNumber(value), unit)
  const weightInTargetUnit = convertWeightIntoTargetUnit(
    weightInGramm,
    targetUnit
  ).toNumber()
  return { value: weightInTargetUnit, unit: targetUnit }
}
