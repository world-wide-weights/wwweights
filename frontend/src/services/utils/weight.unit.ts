import { generateWeightProgressBarPercentage, generateWeightString } from "./weight"

describe("Generate Weight String", () => {
    it("should create string with weight value", () => {
        expect(generateWeightString({ value: 200, isCa: false })).equal("200 g")
    })
    it("should create string with weight value and range", () => {
        expect(generateWeightString({ value: 200, additionalValue: 300, isCa: false })).equal("200-300 g")
    })

    it("should create string with weight value and ca", () => {
        expect(generateWeightString({ value: 200, isCa: true })).equal("ca. 200 g")
    })

    it("should create string with weight value and ca and range", () => {
        expect(generateWeightString({ value: 200, additionalValue: 300, isCa: true })).equal("ca. 200-300 g")
    })
})

describe('Generate Weight Process Bar Percentage', () => {
    it("should get correct percentage with weight value and heaviestWeight normal", () => {
        expect(generateWeightProgressBarPercentage({ value: 100, isCa: false }, { value: 200, isCa: false })).to.deep.equal({ percentage: 50 })
        expect(generateWeightProgressBarPercentage({ value: 100, isCa: false }, { value: 300, isCa: false })).to.deep.equal({ percentage: 33.33 })

        expect(generateWeightProgressBarPercentage({ value: 100, isCa: true }, { value: 200, isCa: true })).to.deep.equal({ percentage: 50 })
    })

    it("should get correct percentage with weight additionalValue value and heaviestWeight normal", () => {
        expect(generateWeightProgressBarPercentage({ value: 100, additionalValue: 200, isCa: false }, { value: 400, isCa: false })).to.deep.equal({ percentage: 25, percentageAdditional: 50 })
        expect(generateWeightProgressBarPercentage({ value: 100, additionalValue: 200, isCa: false }, { value: 300, isCa: false })).to.deep.equal({ percentage: 33.33, percentageAdditional: 66.67 })

        expect(generateWeightProgressBarPercentage({ value: 100, additionalValue: 200, isCa: true }, { value: 300, isCa: true })).to.deep.equal({ percentage: 33.33, percentageAdditional: 66.67 })
    })

    it("should get correct percentage with weight additionalValue and heaviestWeight has additionalValue", () => {
        expect(generateWeightProgressBarPercentage({ value: 100, additionalValue: 200, isCa: true }, { value: 200, additionalValue: 300, isCa: true })).to.deep.equal({ percentage: 33.33, percentageAdditional: 66.67 })
        expect(generateWeightProgressBarPercentage({ value: 100, additionalValue: 200, isCa: false }, { value: 200, additionalValue: 300, isCa: false })).to.deep.equal({ percentage: 33.33, percentageAdditional: 66.67 })
    })

    describe('Weight same as Heaviest', () => {
        it("should get correct percentage when weight is heaviest value", () => {
            expect(generateWeightProgressBarPercentage({ value: 100, isCa: true }, { value: 100, isCa: true })).to.deep.equal({ percentage: 100 })
            expect(generateWeightProgressBarPercentage({ value: 100, isCa: false }, { value: 100, isCa: false })).to.deep.equal({ percentage: 100 })
        })

        it("should get correct percentage when weight is heaviest value with additionalValue", () => {
            expect(generateWeightProgressBarPercentage({ value: 100, isCa: true }, { value: 80, additionalValue: 100, isCa: true })).to.deep.equal({ percentage: 100 })
            expect(generateWeightProgressBarPercentage({ value: 100, isCa: false }, { value: 80, additionalValue: 100, isCa: false })).to.deep.equal({ percentage: 100 })
        })

        it("should get correct percentage when weight with additionalValue is heaviest value", () => {
            expect(generateWeightProgressBarPercentage({ value: 100, additionalValue: 200, isCa: true }, { value: 200, isCa: true })).to.deep.equal({ percentage: 50, percentageAdditional: 100 })
            expect(generateWeightProgressBarPercentage({ value: 100, additionalValue: 200, isCa: false }, { value: 200, isCa: false })).to.deep.equal({ percentage: 50, percentageAdditional: 100 })
        })

        it("should get correct percentage when weight with additionalValue is heaviest value with additionalValue", () => {
            expect(generateWeightProgressBarPercentage({ value: 50, additionalValue: 100, isCa: true }, { value: 80, additionalValue: 100, isCa: true })).to.deep.equal({ percentage: 50, percentageAdditional: 100 })
            expect(generateWeightProgressBarPercentage({ value: 50, additionalValue: 100, isCa: false }, { value: 80, additionalValue: 100, isCa: false })).to.deep.equal({ percentage: 50, percentageAdditional: 100 })
        })
    })
})