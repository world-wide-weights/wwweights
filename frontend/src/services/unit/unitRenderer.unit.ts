import { getBestHumanReadableUnit } from "./unitHumanReadable"
import { renderUnitIntoString } from "./unitRenderer"


describe("unitRenderer", () => {
    it("it should choose Pg for best readable Unit", () => {
        expect(renderUnitIntoString({
            value: 9.9237,
            additionalValue: 0.0012,
            isCa: true
        })).deep.equal("ca. 9pg")
    })
})