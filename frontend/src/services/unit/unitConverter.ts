import BigNumber from "bignumber.js"
import { Unit, WeightWithUnit } from "../../types/unit"

/**
 * The number of comma shifts for each unit.
 */
const commaShiftsForUnit: { [K in Unit]: number } = {
  ag: -18,
  fg: -15,
  pg: -12,
  ng: -9,
  µg: -6,
  mg: -3,
  g: 0,
  kg: 3,
  Mg: 6,
  Tg: 12,
  Pg: 15,
  Eg: 18,
  Zg: 21,
  Yg: 24,
  Rg: 27,
  Qg: 30,
}

// FOR FUTURE WORK, see: https://en.wikipedia.org/wiki/Orders_of_magnitude_(mass)

/**
 * Shifts the comma in a given number.
 * @param value the number where the comma shift should be applied.
 * @param movaComma the number of how many comma shifts it should make.
 * @param left in which direction the comma should be shifted.
 * @returns the number with the given comma shift.
 */
export const calculateCommaShift = (
  value: BigNumber,
  moveComma: number,
  left: Boolean
): BigNumber => {
  if(moveComma === 0) return value
  console.log(value.toString())
  if (left) {
    console.log(value.multipliedBy(BigNumber(10).exponentiatedBy(moveComma)))
    return value.multipliedBy(BigNumber(10).exponentiatedBy(moveComma))
  } else {
    console.log(value.dividedBy(BigNumber(10).exponentiatedBy(moveComma)))
    return value.dividedBy(BigNumber(10).exponentiatedBy(moveComma))
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
): number => {
  return calculateCommaShift(value, commaShiftsForUnit[targetUnit], false).toNumber()
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
): WeightWithUnit => {
  const weightInGramm = convertAnyWeightIntoGram(new BigNumber(value), unit)
  const weightInTargetUnitAsBigNumber = convertWeightIntoTargetUnit(
    weightInGramm,
    targetUnit
  )
  return { value: weightInTargetUnitAsBigNumber, unit: targetUnit }
}
