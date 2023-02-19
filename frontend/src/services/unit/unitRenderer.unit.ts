import { renderUnitIntoString, roundNumber } from "./unitRenderer"
describe("roundNumber Function", () => {
	it("it should round number", () => {
		expect(roundNumber(1.234)).deep.equal("1.234")
		expect(roundNumber(1.2345)).deep.equal("1.235")
		expect(roundNumber(1.234567)).deep.equal("1.235")
		expect(roundNumber(1.234267)).deep.equal("1.234")
		expect(roundNumber(1.23)).deep.equal("1.23")
		expect(roundNumber(1.2)).deep.equal("1.2")
		expect(roundNumber(5)).deep.equal("5")
	})
})

describe("renderUnitIntoString Function", () => {
	it("it should display 'ca.'", () => {
		expect(
			renderUnitIntoString({
				value: 9,
				additionalValue: 12,
				isCa: true,
			})
		).deep.equal("ca. 9 - 12 g")
		expect(
			renderUnitIntoString({
				value: 123243342,
				additionalValue: 123289765,
				isCa: true,
			})
		).deep.equal("ca. 123.243 - 123.29 T")
		expect(
			renderUnitIntoString({
				value: 9,
				additionalValue: 0,
				isCa: true,
			})
		).deep.equal("ca. 9 g")
		expect(
			renderUnitIntoString({
				value: 0.0126,
				additionalValue: 0.0645,
				isCa: true,
			})
		).deep.equal("ca. 12.6 - 64.5 mg")
	})

	it("it should NOT display 'ca.'", () => {
		expect(
			renderUnitIntoString({
				value: 9,
				additionalValue: 12,
				isCa: false,
			})
		).deep.equal("9 - 12 g")
		expect(
			renderUnitIntoString({
				value: 123243342,
				additionalValue: 123289765,
				isCa: false,
			})
		).deep.equal("123.243 - 123.29 T")
		expect(
			renderUnitIntoString({
				value: 9,
				additionalValue: 0,
				isCa: false,
			})
		).deep.equal("9 g")
		expect(
			renderUnitIntoString({
				value: 0.0126,
				additionalValue: 0.0645,
				isCa: false,
			})
		).deep.equal("12.6 - 64.5 mg")
	})

	it("it should display additionalValue", () => {
		expect(
			renderUnitIntoString({
				value: 9,
				additionalValue: 12,
				isCa: false,
			})
		).deep.equal("9 - 12 g")
		expect(
			renderUnitIntoString({
				value: 123243342,
				additionalValue: 123289765,
				isCa: false,
			})
		).deep.equal("123.243 - 123.29 T")
		expect(
			renderUnitIntoString({
				value: 9,
				additionalValue: 40,
				isCa: false,
			})
		).deep.equal("9 - 40 g")
		expect(
			renderUnitIntoString({
				value: 0.0126,
				additionalValue: 0.0645,
				isCa: false,
			})
		).deep.equal("12.6 - 64.5 mg")
	})

	it("it should NOT display additionalValue", () => {
		expect(
			renderUnitIntoString({
				value: 9,
				additionalValue: 0,
				isCa: false,
			})
		).deep.equal("9 g")
		expect(
			renderUnitIntoString({
				value: 123243342,
				additionalValue: 0,
				isCa: false,
			})
		).deep.equal("123.243 T")
		expect(
			renderUnitIntoString({
				value: 9,
				additionalValue: 0,
				isCa: false,
			})
		).deep.equal("9 g")
		expect(
			renderUnitIntoString({
				value: 0.0126,
				additionalValue: 0,
				isCa: false,
			})
		).deep.equal("12.6 mg")
	})

	it("it should format numbers to two numbers after comma", () => {
		expect(
			renderUnitIntoString({
				value: 9.123,
				additionalValue: 99.1233413,
				isCa: false,
			})
		).deep.equal("9.123 - 99.123 g")
		expect(
			renderUnitIntoString({
				value: 123243342.1233413,
				additionalValue: 153474223.1233413,
				isCa: false,
			})
		).deep.equal("123.243 - 153.474 T")
		expect(
			renderUnitIntoString({
				value: 0.273213,
				additionalValue: 0.671823,
				isCa: false,
			})
		).deep.equal("273.213 - 671.823 mg")
		expect(
			renderUnitIntoString({
				value: 0.0126,
				additionalValue: 0.0234,
				isCa: false,
			})
		).deep.equal("12.6 - 23.4 mg")
		expect(
			renderUnitIntoString({
				value: 1,
				additionalValue: 100000000,
				isCa: false,
			})
		).deep.equal("1 - 100,000,000 g")
	})

	it("it should show high numbers correctly", () => {
		expect(
			renderUnitIntoString({
				value: 1000000000000000,
				additionalValue: 0,
				isCa: false,
			})
		).deep.equal("1 Pg")
		expect(
			renderUnitIntoString({
				value: 1e18,
				additionalValue: 0,
				isCa: false,
			})
		).deep.equal("1 Eg")
		expect(
			renderUnitIntoString({
				value: 1e21,
				additionalValue: 0,
				isCa: false,
			})
		).deep.equal("1 Zg")
		expect(
			renderUnitIntoString({
				value: 1e24,
				additionalValue: 0,
				isCa: false,
			})
		).deep.equal("1 Yg")
		expect(
			renderUnitIntoString({
				value: 1e27,
				additionalValue: 0,
				isCa: false,
			})
		).deep.equal("1 Rg")
		expect(
			renderUnitIntoString({
				value: 1e30,
				additionalValue: 0,
				isCa: false,
			})
		).deep.equal("1 Qg")
	})

	it("it should make points for seperation", () => {
		expect(
			renderUnitIntoString({
				value: 1,
				additionalValue: 100000000,
				isCa: false,
			})
		).deep.equal("1 - 100,000,000 g")
		expect(
			renderUnitIntoString({
				value: 1e38,
				additionalValue: 0,
				isCa: false,
			})
		).deep.equal("100,000,000 Qg")
		expect(
			renderUnitIntoString({
				value: 1000,
				additionalValue: 1000000,
				isCa: false,
			})
		).deep.equal("1 - 1,000 kg")
	})
})
