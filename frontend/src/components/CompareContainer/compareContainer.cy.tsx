import "material-symbols"
import "../../styles/global.css"
import { CompareContainer } from "./CompareContainer"

const WATER_BOTTLE_WEIGHT = 1_100
const PERSON_WEIGHT = 62_000
const EARTH_WEIGHT = 5.97200000000000062e+27
const AIRPLANE_WEIGHT = 1e+8
const CAR_WEIGHT = 1_400_000

describe("Stats Compare Card", () => {
    it("should display water bottles", () => {
        cy.mount(<CompareContainer weight={WATER_BOTTLE_WEIGHT + 1} itemName="Test" />)
        cy.contains("Water bottle").should("be.visible")
    })

    it("should display carTruck only when weight is greater than a car", () => {
        cy.mount(<CompareContainer weight={CAR_WEIGHT + 1} itemName="Test" />)
        cy.contains("Car").should("be.visible")
    })

    it("should display earths only when weight is greater or equal than earth", () => {
        cy.mount(<CompareContainer weight={EARTH_WEIGHT + 1} itemName="Test" />)
        cy.contains("Earth").should("be.visible")
    })

    it("should display people only when weight is greater than a person", () => {
        cy.mount(<CompareContainer weight={PERSON_WEIGHT + 1} itemName="Test" />)
        cy.contains("Person").should("be.visible")
    })

    it("should display airplaneTitanic only when weight is greater than an airplane", () => {
        cy.mount(<CompareContainer weight={AIRPLANE_WEIGHT + 1} itemName="Test" />)
        cy.contains("Airplane").should("be.visible")
    })
})

export { }

