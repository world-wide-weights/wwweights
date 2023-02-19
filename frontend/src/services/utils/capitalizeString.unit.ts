import { capitalizeFirstLetter } from "./capitalizeString"

describe("Capitalize String", () => {
	it("should capitalize first letter of string when string is lowercase", () => {
		expect(capitalizeFirstLetter("test")).equal("Test")
		expect(capitalizeFirstLetter("joy")).equal("Joy")
		expect(capitalizeFirstLetter("test1343")).equal("Test1343")
		expect(capitalizeFirstLetter("13test1343")).equal("13test1343")
	})

	it("should only capitalize first letter", () => {
		expect(capitalizeFirstLetter("tEST")).equal("TEST")
		expect(capitalizeFirstLetter("jOy")).equal("JOy")
		expect(capitalizeFirstLetter("tESt1343")).equal("TESt1343")
	})

	it("should change nothing when first letter is already uppercase", () => {
		expect(capitalizeFirstLetter("TEST")).equal("TEST")
		expect(capitalizeFirstLetter("JOY")).equal("JOY")
	})
})

export {}
