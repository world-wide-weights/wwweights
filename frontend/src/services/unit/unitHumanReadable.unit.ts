import { getBestHumanReadableUnit } from "./unitHumanReadable"


describe("unitHumanReadable", () => {
    it("it should choose Pg for best readable Unit", () => {
        expect(getBestHumanReadableUnit(1000000000000000
        )).deep.equal({ value: 1, unit: "Pg" })
        expect(getBestHumanReadableUnit(15300000000000000
            )).deep.equal({ value: 15.3, unit: "Pg" })
        expect(getBestHumanReadableUnit(77700000000000000000)).deep.equal({ value: 77700, unit: "Pg" })
    })
    it("it should choose Tg for best readable Unit", () => {
        expect(getBestHumanReadableUnit(1000000000000)).deep.equal({ value: 1, unit: "Tg" })
        expect(getBestHumanReadableUnit(15300000000000)).deep.equal({ value: 15.3, unit: "Tg" })
    })
    it("it should choose Mg for best readable Unit", () => {
        expect(getBestHumanReadableUnit(145000000)).deep.equal({ value: 145, unit: "Mg" })
        expect(getBestHumanReadableUnit(8240000000)).deep.equal({ value: 8240, unit: "Mg" })
    })
    it("it should choose kg for best readable Unit", () => {
        expect(getBestHumanReadableUnit(1000)).deep.equal({ value: 1, unit: "kg" })
        expect(getBestHumanReadableUnit(160000)).deep.equal({ value: 160, unit: "kg" })
    })
    it("it should choose g for best readable Unit", () => {
        expect(getBestHumanReadableUnit(400)).deep.equal({ value: 400, unit: "g" })
        expect(getBestHumanReadableUnit(3)).deep.equal({ value: 3, unit: "g" })
    })
    it("it should choose mg for best readable Unit", () => {
        expect(getBestHumanReadableUnit(0.345)).deep.equal({ value: 345, unit: "mg" })
        expect(getBestHumanReadableUnit(0.034)).deep.equal({ value: 34, unit: "mg" })
    })
    it("it should choose µg for best readable Unit", () => {
        expect(getBestHumanReadableUnit(0.000732)).deep.equal({ value: 732, unit: "µg" })
        expect(getBestHumanReadableUnit(0.000099)).deep.equal({ value: 99, unit: "µg" })
    })
    it("it should choose ng for best readable Unit", () => {
        expect(getBestHumanReadableUnit(0.000000345)).deep.equal({ value: 345, unit: "ng" })
        expect(getBestHumanReadableUnit(0.000000640)).deep.equal({ value: 640, unit: "ng" })
    })
    it("it should choose pg for best readable Unit", () => {
        expect(getBestHumanReadableUnit(0.000000000777)).deep.equal({ value: 777, unit: "pg" })
        expect(getBestHumanReadableUnit(0.000000000009)).deep.equal({ value: 9, unit: "pg" })
        expect(getBestHumanReadableUnit(0.000000000000004)).deep.equal({ value: 0.004, unit: "pg" })
    })
})