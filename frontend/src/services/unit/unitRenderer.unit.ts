import { renderUnitIntoString } from "./unitRenderer"


describe("unitRenderer", () => {
    it("it should display 'ca.'", () => {
        expect(renderUnitIntoString({
            value: 9,
            additionalValue: 12,
            isCa: true
        })).deep.equal("ca. 9 - 12 g")
        expect(renderUnitIntoString({
            value: 123243342,
            additionalValue: 123289765,
            isCa: true
        })).deep.equal("ca. 123.24 - 123.29 Mg")
        expect(renderUnitIntoString({
            value: 9,
            additionalValue: 0,
            isCa: true
        })).deep.equal("ca. 9 g")
        expect(renderUnitIntoString({
            value: 0.0126,
            additionalValue: 0.0645,
            isCa: true
        })).deep.equal("ca. 12.60 - 64.50 mg")
    })
    it("it should NOT display 'ca.'", () => {
        expect(renderUnitIntoString({
            value: 9,
            additionalValue: 12,
            isCa: false
        })).deep.equal("9 - 12 g")
        expect(renderUnitIntoString({
            value: 123243342,
            additionalValue: 123289765,
            isCa: false
        })).deep.equal("123.24 - 123.29 Mg")
        expect(renderUnitIntoString({
            value: 9,
            additionalValue: 0,
            isCa: false
        })).deep.equal("9 g")
        expect(renderUnitIntoString({
            value: 0.0126,
            additionalValue: 0.0645,
            isCa: false
        })).deep.equal("12.60 - 64.50 mg")
    })
    it("it should display additionalValue", () => {
        expect(renderUnitIntoString({
            value: 9,
            additionalValue: 12,
            isCa: false
        })).deep.equal("9 - 12 g")
        expect(renderUnitIntoString({
            value: 123243342,
            additionalValue: 123289765,
            isCa: false
        })).deep.equal("123.24 - 123.29 Mg")
        expect(renderUnitIntoString({
            value: 9,
            additionalValue: 40,
            isCa: false
        })).deep.equal("9 - 40 g")
        expect(renderUnitIntoString({
            value: 0.0126,
            additionalValue: 0.0645,
            isCa: false
        })).deep.equal("12.60 - 64.50 mg")
    })
    it("it should NOT display additionalValue", () => {
        expect(renderUnitIntoString({
            value: 9,
            additionalValue: 0,
            isCa: false
        })).deep.equal("9 g")
        expect(renderUnitIntoString({
            value: 123243342,
            additionalValue: 0,
            isCa: false
        })).deep.equal("123.24 Mg")
        expect(renderUnitIntoString({
            value: 9,
            additionalValue: 0,
            isCa: false
        })).deep.equal("9 g")
        expect(renderUnitIntoString({
            value: 0.0126,
            additionalValue: 0,
            isCa: false
        })).deep.equal("12.60 mg")
    })
    it("it should format numbers to two numbers after comma", () => {
        expect(renderUnitIntoString({
            value: 9.123,
            additionalValue: 99.1233413,
            isCa: false
        })).deep.equal("9.12 - 99.12 g")
        expect(renderUnitIntoString({
            value: 123243342.1233413,
            additionalValue: 153474223.1233413,
            isCa: false
        })).deep.equal("123.24 - 153.47 Mg")
        expect(renderUnitIntoString({
            value: 0.273213,
            additionalValue: 0.671823,
            isCa: false
        })).deep.equal("273.21 - 671.82 mg")
        expect(renderUnitIntoString({
            value: 0.0126,
            additionalValue: 0.0234,
            isCa: false
        })).deep.equal("12.60 - 23.40 mg")
    })
})