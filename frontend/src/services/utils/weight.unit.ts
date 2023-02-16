import { calculateMedianWeight, calculateWeightFit, generateWeightProgressBarPercentage, generateWeightString, getSortedItemsAndHeaviest } from "./weight"

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

describe("Generate Weight Process Bar Percentage", () => {
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

    // Bug: https://github.com/world-wide-weights/wwweights/issues/329
    it("should use additionaValue in heaviestWeight", () => {
        expect(generateWeightProgressBarPercentage({ value: 200, isCa: false }, { value: 200, additionalValue: 400, isCa: false })).to.deep.equal({ percentage: 50 })
        expect(generateWeightProgressBarPercentage({ value: 200, additionalValue: 300, isCa: false }, { value: 200, additionalValue: 400, isCa: false })).to.deep.equal({ percentage: 50, percentageAdditional: 3 / 4 * 100 })
    })

    describe("Weight same as Heaviest", () => {
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

    describe("Bug Fix #307 - Wrong percentage when additional weight is smaller than value", () => {
        it("should get percentage from value when it's bigger than additionalValue", () => {
            expect(generateWeightProgressBarPercentage({ value: 500, isCa: true }, { value: 1000, isCa: true, additionalValue: 0 })).to.deep.equal({ percentage: 50 })
        })
    })
})

describe("Calculate Median Weight", () => {
    it("should calculate median from additional value and value", () => {
        expect(calculateMedianWeight({ value: 200, additionalValue: 400, isCa: false })).equal(300)
        expect(calculateMedianWeight({ value: 10, additionalValue: 100, isCa: false })).equal(55)

        expect(calculateMedianWeight({ value: 10, additionalValue: 10, isCa: false })).equal(10)
        expect(calculateMedianWeight({ value: 9, additionalValue: 10, isCa: false })).equal(9)
    })

    it("should return value when additional not defined", () => {
        expect(calculateMedianWeight({ value: 200, isCa: false })).equal(200)
        expect(calculateMedianWeight({ value: 200, isCa: true })).equal(200)
    })
})

describe("Calculate the number of weights that fit in a container and round", () => {
    describe("Base tests", () => {
        it("should return 2 when weight is 8 and compareWeight is 4", () => {
            expect(calculateWeightFit(8, 4)).to.equal(2)
        })

        it("should return 3 when weight is 18 and compareWeight is 6", () => {
            expect(calculateWeightFit(18, 6)).to.equal(3)
        })

        it("should return 0 when weight is 0 and compareWeight is 18", () => {
            expect(calculateWeightFit(0, 18)).to.equal(0)
        })

        it("should return 0 when weight is 10 and compareWeight is 0", () => {
            expect(calculateWeightFit(0, 10)).to.equal(0)
        })

        it("should return 0 when weight is 0 and compareWeight is 0", () => {
            expect(calculateWeightFit(0, 0)).to.equal(0)
        })
    })

    it("should match exact number of items when dividable", () => {
        expect(calculateWeightFit(100, 10)).to.equal(10)
        expect(calculateWeightFit(100, 100)).to.equal(1)
        expect(calculateWeightFit(1000, 100)).to.equal(10)
    })

    it("should round up to the nearest whole number when over 0.5", () => {
        expect(calculateWeightFit(100, 15)).to.equal(7)
        expect(calculateWeightFit(1000, 15)).to.equal(67)
    })

    it("should handle weights that are larger than the container", () => {
        expect(calculateWeightFit(100, 200)).to.equal(1)
        expect(calculateWeightFit(100, 250)).to.equal(0)
    })
})

describe("Get SortedItems and Get HeaviestWeight", () => {
    const items = [{
        name: "test",
        slug: "test",
        weight: { value: 10 },
        tags: [],
        userId: 1,
        createdAt: 123,
    }, {
        name: "test",
        slug: "test",
        weight: { value: 20 },
        tags: [],
        userId: 1,
        createdAt: 123,
    }, {
        name: "test",
        slug: "test",
        weight: { value: 5 },
        tags: [],
        userId: 1,
        createdAt: 123,
    }]

    it("should sort items in ascending order and return the heaviest weight", () => {
        const result = getSortedItemsAndHeaviest(items, "asc")
        expect(result).to.deep.equal({
            items: [{
                name: "test",
                slug: "test",
                weight: { value: 5 },
                tags: [],
                userId: 1,
                createdAt: 123,
            }, {
                name: "test",
                slug: "test",
                weight: { value: 10 },
                tags: [],
                userId: 1,
                createdAt: 123,
            }, {
                name: "test",
                slug: "test",
                weight: { value: 20 },
                tags: [],
                userId: 1,
                createdAt: 123,
            }],
            heaviestWeight: { value: 20 }
        })
    })

    it("should sort items in descending order and return the heaviest weight", () => {
        const result = getSortedItemsAndHeaviest(items, "desc")
        expect(result).to.deep.equal({
            items: [{
                name: "test",
                slug: "test",
                weight: { value: 20 },
                tags: [],
                userId: 1,
                createdAt: 123,
            }, {
                name: "test",
                slug: "test",
                weight: { value: 10 },
                tags: [],
                userId: 1,
                createdAt: 123,
            }, {
                name: "test",
                slug: "test",
                weight: { value: 5 },
                tags: [],
                userId: 1,
                createdAt: 123,
            }],
            heaviestWeight: { value: 20 }
        })
    })
})