import { getBestHumanReadableUnit } from "./unitHumanReadable"

describe("UnitHumanReadable", () => {
    it("it should choose Qg for best readable Unit", () => {
        expect(getBestHumanReadableUnit(1e30)).deep.equal({ value: 1, unit: "Qg" })
        expect(getBestHumanReadableUnit(15.3e30)).deep.equal({ value: 15.3, unit: "Qg" })
        expect(getBestHumanReadableUnit(1e34)).deep.equal({ value: 10000, unit: "Qg" })
    })

    it("it should choose Rg for best readable Unit", () => {
        expect(getBestHumanReadableUnit(1e27)).deep.equal({ value: 1, unit: "Rg" })
        expect(getBestHumanReadableUnit(15.3e27)).deep.equal({ value: 15.3, unit: "Rg" })
    })

    it("it should choose Yg for best readable Unit", () => {
        expect(getBestHumanReadableUnit(1e24)).deep.equal({ value: 1, unit: "Yg" })
        expect(getBestHumanReadableUnit(15.3e24)).deep.equal({ value: 15.3, unit: "Yg" })
    })

    it("it should choose Zg for best readable Unit", () => {
        expect(getBestHumanReadableUnit(1e21)).deep.equal({ value: 1, unit: "Zg" })
        expect(getBestHumanReadableUnit(15.3e21)).deep.equal({ value: 15.3, unit: "Zg" })
    })

    it("it should choose Eg for best readable Unit", () => {
        expect(getBestHumanReadableUnit(1e18)).deep.equal({ value: 1, unit: "Eg" })
        expect(getBestHumanReadableUnit(15.3e18)).deep.equal({ value: 15.3, unit: "Eg" })
    })

    it("it should choose Pg for best readable Unit", () => {
        expect(getBestHumanReadableUnit(1000000000000000
        )).deep.equal({ value: 1, unit: "Pg" })
        expect(getBestHumanReadableUnit(15300000000000000
        )).deep.equal({ value: 15.3, unit: "Pg" })
    })

    it("it should choose Tg for best readable Unit", () => {
        expect(getBestHumanReadableUnit(1000000000000)).deep.equal({ value: 1, unit: "Tg" })
        expect(getBestHumanReadableUnit(15300000000000)).deep.equal({ value: 15.3, unit: "Tg" })
    })

    it("it should choose Mg for best readable Unit", () => {
        expect(getBestHumanReadableUnit(145000000)).deep.equal({ value: 145, unit: "T" })
        expect(getBestHumanReadableUnit(8240000000)).deep.equal({ value: 8240, unit: "T" })
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
    })

    it("it should choose fg for best readable Unit", () => {
        expect(getBestHumanReadableUnit(1e-15)).deep.equal({ value: 1, unit: "fg" })
        expect(getBestHumanReadableUnit(1e-13)).deep.equal({ value: 100, unit: "fg" })
    })

    it("it should choose ag for best readable Unit", () => {
        expect(getBestHumanReadableUnit(1e-18)).deep.equal({ value: 1, unit: "ag" })
        expect(getBestHumanReadableUnit(1e-16)).deep.equal({ value: 100, unit: "ag" })
    })
})