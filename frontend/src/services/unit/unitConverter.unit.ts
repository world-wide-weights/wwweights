import BigNumber from "bignumber.js"
import { calculateCommaShift, convertAnyWeightIntoGram, convertWeightIntoTargetUnit, convertWeightIntoUnit } from "./unitConverter"

describe("UnitConverter", () => {
	describe("Test calculateCommaShift function ", () => {
		it("should shift the comma correct", () => {
			expect(calculateCommaShift(new BigNumber(1), 6, true).toNumber()).equal(1000000)
			expect(calculateCommaShift(new BigNumber(1), 9, true).toNumber()).equal(1e9)
			expect(calculateCommaShift(new BigNumber(1), 12, true).toNumber()).equal(1e12)
			expect(calculateCommaShift(new BigNumber(1), 20, true).toNumber()).equal(1e20)
			expect(calculateCommaShift(new BigNumber(1), 21, true).toNumber()).equal(1e21)
			expect(calculateCommaShift(new BigNumber(1), 30, true).toNumber()).equal(1e30)
		})

		it("should shift the comma into the correct direction", () => {
			expect(calculateCommaShift(new BigNumber(1), 3, true).toNumber()).equal(1000)
			expect(calculateCommaShift(new BigNumber(1), 3, false).toNumber()).equal(0.001)
		})
	})

	describe("test convertAnyWeightIntoGram function", () => {
		it("should convert any weight into gram", () => {
			expect(convertAnyWeightIntoGram(new BigNumber(1), "pg").toNumber()).equal(1e-12)
			expect(convertAnyWeightIntoGram(new BigNumber(1), "ng").toNumber()).equal(1e-9)
			expect(convertAnyWeightIntoGram(new BigNumber(1), "µg").toNumber()).equal(1e-6)
			expect(convertAnyWeightIntoGram(new BigNumber(1), "mg").toNumber()).equal(0.001)
			expect(convertAnyWeightIntoGram(new BigNumber(1), "g").toNumber()).equal(1)
			expect(convertAnyWeightIntoGram(new BigNumber(1), "kg").toNumber()).equal(1000)
			expect(convertAnyWeightIntoGram(new BigNumber(1), "T").toNumber()).equal(1e6)
			expect(convertAnyWeightIntoGram(new BigNumber(1), "Tg").toNumber()).equal(1e12)
			expect(convertAnyWeightIntoGram(new BigNumber(1), "Pg").toNumber()).equal(1e15)
		})
	})

	describe("test convertWeightIntoTargetUnit function", () => {
		it("should convert weight in gram into any unit", () => {
			expect(convertWeightIntoTargetUnit(new BigNumber(1), "pg")).equal(1e12)
			expect(convertWeightIntoTargetUnit(new BigNumber(1), "ng")).equal(1e9)
			expect(convertWeightIntoTargetUnit(new BigNumber(1), "µg")).equal(1e6)
			expect(convertWeightIntoTargetUnit(new BigNumber(1), "mg")).equal(1000)
			expect(convertWeightIntoTargetUnit(new BigNumber(1), "g")).equal(1)
			expect(convertWeightIntoTargetUnit(new BigNumber(1), "kg")).equal(0.001)
			expect(convertWeightIntoTargetUnit(new BigNumber(1), "T")).equal(1e-6)
			expect(convertWeightIntoTargetUnit(new BigNumber(1), "Tg")).equal(1e-12)
			expect(convertWeightIntoTargetUnit(new BigNumber(1), "Pg")).equal(1e-15)
		})
	})

	describe("test main function: convertWeightIntoUnit", () => {
		it("should convert value 1 with any unit into any other unit", () => {
			expect(convertWeightIntoUnit(1, "Pg", "mg")).deep.equal({
				value: 1e18,
				unit: "mg",
			})
			expect(convertWeightIntoUnit(1, "T", "ng")).deep.equal({
				value: 1e15,
				unit: "ng",
			})
			expect(convertWeightIntoUnit(1, "kg", "mg")).deep.equal({
				value: 1e6,
				unit: "mg",
			})
			expect(convertWeightIntoUnit(1, "T", "Tg")).deep.equal({
				value: 1e-6,
				unit: "Tg",
			})
			expect(convertWeightIntoUnit(1, "mg", "pg")).deep.equal({
				value: 1e9,
				unit: "pg",
			})
			expect(convertWeightIntoUnit(1, "pg", "T")).deep.equal({
				value: 1e-18,
				unit: "T",
			})
			expect(convertWeightIntoUnit(1, "kg", "µg")).deep.equal({
				value: 1e9,
				unit: "µg",
			})
		})

		it("should convert any values with any unit into any other unit", () => {
			expect(convertWeightIntoUnit(100, "Pg", "mg")).deep.equal({
				value: 1e20,
				unit: "mg",
			})
			expect(convertWeightIntoUnit(0.23, "T", "ng")).deep.equal({
				value: 2.3e14,
				unit: "ng",
			})
			expect(convertWeightIntoUnit(1444423, "kg", "mg")).deep.equal({
				value: 1.444423e12,
				unit: "mg",
			})
			expect(convertWeightIntoUnit(5, "T", "Tg")).deep.equal({
				value: 5e-6,
				unit: "Tg",
			})
			expect(convertWeightIntoUnit(7.45, "mg", "pg")).deep.equal({
				value: 7.45e9,
				unit: "pg",
			})
			expect(convertWeightIntoUnit(836.343, "kg", "µg")).deep.equal({
				value: 8.36343e11,
				unit: "µg",
			})
			expect(convertWeightIntoUnit(1.234, "g", "g")).deep.equal({
				value: 1.234,
				unit: "g",
			})
			expect(convertWeightIntoUnit(1.234e1, "g", "g")).deep.equal({
				value: 12.34,
				unit: "g",
			})
			expect(convertWeightIntoUnit(1.234e-2, "T", "T")).deep.equal({
				value: 0.01234,
				unit: "T",
			})
		})
	})
})
