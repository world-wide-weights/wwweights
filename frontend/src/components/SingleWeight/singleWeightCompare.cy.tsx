import "material-symbols"
import "../../styles/global.css"
import { compareTypes } from "../Statistics/StatsCompareCard"
import { SingleWeightCompare } from "./SingleWeightCompare"

describe("Stats Compare Card", () => {
    it("should display water bottles", () => {
        cy.mount(<SingleWeightCompare weight={100} itemName="Test" />)
        cy.contains(compareTypes["water_bottle"].singular).should("be.visible")
    })

    it("should display carVehicle only when weight is greater than a car", () => {
        cy.mount(<SingleWeightCompare weight={compareTypes["carVehicle"].weight + 1} itemName="Test" />)
        cy.contains(compareTypes["carVehicle"].singular).should("be.visible")
    })

    it("should display earths only when weight is greater or equal an earth", () => {
        cy.mount(<SingleWeightCompare weight={compareTypes["earths"].weight + 1} itemName="Test" />)
        cy.contains(compareTypes["earths"].singular).should("be.visible")
    })

    it("should display people only when weight is greater than a person", () => {
        cy.mount(<SingleWeightCompare weight={compareTypes["people"].weight + 1} itemName="Test" />)
        cy.contains(compareTypes["people"].singular).should("be.visible")
    })

    it("should display titanicAirplane only when weight is greater than an airplane", () => {
        cy.mount(<SingleWeightCompare weight={compareTypes["titanicAirplane"].weight + 1} itemName="Test" />)
        cy.contains(compareTypes["titanicAirplane"].singular).should("be.visible")
    })
})

export { }

