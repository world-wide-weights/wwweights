import { generateWeightString } from "./weight"

describe("Range", () => {
    it("should create string with weight value", () => {
        expect(generateWeightString({
            value: 200,
            isCa: false
        })).equal("200 g")
    })
    it("should create string with weight value and range", () => {
        expect(generateWeightString({
            value: 200,
            aditionalValue: 300,
            isCa: false
        }
        )).equal("200-300 g")
    })

    it("should create string with weight value and ca", () => {
        expect(generateWeightString({
            value: 200,
            isCa: true
        })).equal("ca. 200 g")
    })

    it("should create string with weight value and ca and range", () => {
        expect(generateWeightString({
            value: 200,
            aditionalValue: 300,
            isCa: true
        })).equal("ca. 200-300 g")
    })
})