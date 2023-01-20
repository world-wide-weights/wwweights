import { getBestHumanReadableUnit } from "./unitHumanReadable"
import { Weight } from "../../pages/weights";

const weight: Weight = {
    value: 1,
    additionalValue: 0,
    isCa: false
}


describe("unitHumanReadable", () => {
    it("test", () => {
        expect(getBestHumanReadableUnit({
            value: 100000000000,
            additionalValue: 0,
            isCa: false
        })).deep.equal({ value: 1, unit: "g" })
    })
    it("test", () => {
        expect(getBestHumanReadableUnit({
            value: 145454545,
            additionalValue: 0,
            isCa: false
        })).deep.equal({ value: 1, unit: "g" })
    })
    it("test", () => {
        expect(getBestHumanReadableUnit({
            value: 0.378379,
            additionalValue: 0,
            isCa: false
        })).deep.equal({ value: 1, unit: "g" })
    })
    it("test", () => {
        expect(getBestHumanReadableUnit({
            value: 0.332,
            additionalValue: 0,
            isCa: false
        })).deep.equal({ value: 1, unit: "g" })
    })
})