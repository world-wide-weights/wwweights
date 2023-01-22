import "material-symbols"
import "../../styles/global.css"
import { compareTypes } from "../Statistics/CompareCard"
import { CompareContainer } from "./CompareContainer"

describe("Stats Compare Card", () => {
    it("should display water bottles", () => {
        cy.mount(<CompareContainer weight={compareTypes["waterBottle"].weight + 1} itemName="Test" />)
        cy.contains(compareTypes["waterBottle"].singular).should("be.visible")
    })

    it("should display carTruck only when weight is greater than a car", () => {
        cy.mount(<CompareContainer weight={compareTypes["carTruck"].weight + 1} itemName="Test" />)
        cy.contains(compareTypes["carTruck"].singular).should("be.visible")
    })

    it("should display earths only when weight is greater or equal than earth", () => {
        cy.mount(<CompareContainer weight={compareTypes["earths"].weight + 1} itemName="Test" />)
        cy.contains(compareTypes["earths"].singular).should("be.visible")
    })

    it("should display people only when weight is greater than a person", () => {
        cy.mount(<CompareContainer weight={compareTypes["people"].weight + 1} itemName="Test" />)
        cy.contains(compareTypes["people"].singular).should("be.visible")
    })

    it("should display airplaneTitanic only when weight is greater than an airplane", () => {
        cy.mount(<CompareContainer weight={compareTypes["airplaneTitanic"].weight + 1} itemName="Test" />)
        cy.contains(compareTypes["airplaneTitanic"].singular).should("be.visible")
    })
})

export { }

