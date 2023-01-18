import { getWeightInG } from "./unit"

describe("Unit", () => {
    it("should calculate nothing unit is kg", () => {
        expect(getWeightInG(100, "g")).equal(100)
        expect(getWeightInG(50, "g")).equal(50)
        expect(getWeightInG(10, "g")).equal(10)
    })

    it("should calculate to correct g when unit is kg", () => {
        expect(getWeightInG(100, "kg")).equal(100_000)
        expect(getWeightInG(50, "kg")).equal(50_000)
        expect(getWeightInG(10, "kg")).equal(10_000)
    })

    it("should calculate to correct g when unit is t", () => {
        expect(getWeightInG(100, "t")).equal(100_000_000)
        expect(getWeightInG(50, "t")).equal(50_000_000)
        expect(getWeightInG(10, "t")).equal(10_000_000)
    })
})