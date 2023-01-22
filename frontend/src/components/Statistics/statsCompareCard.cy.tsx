import "material-symbols"
import "../../styles/global.css"
import { compareTypes, StatsCompareCard } from "./StatsCompareCard"

describe("Stats Compare Card", () => {
    describe("Without other compare value", () => {
        it("should display water bottles", () => {
            cy.mount(<StatsCompareCard type="water_bottle" weight={compareTypes["water_bottle"].weight} itemName="Test" />)
            cy.contains(compareTypes["water_bottle"].singular).should("be.visible")
        })

        it("should display people", () => {
            cy.mount(<StatsCompareCard type="people" weight={compareTypes["people"].weight} itemName="Test" />)
            cy.contains(compareTypes["people"].singular).should("be.visible")
        })

        it("should display earth", () => {
            cy.mount(<StatsCompareCard type="earths" weight={compareTypes["earths"].weight} itemName="Test" />)
            cy.contains(compareTypes["earths"].singular).should("be.visible")
        })

        it("should display correct count of icon when < 20", () => {
            cy.mount(<StatsCompareCard type="water_bottle" weight={compareTypes["water_bottle"].weight * 3} itemName="Test" />)
            cy.dataCy("stats-compare-card-icon").should("have.length", 3)
        })

        it("should display 20 icons when > 20", () => {
            cy.mount(<StatsCompareCard type="water_bottle" weight={compareTypes["water_bottle"].weight * 22} itemName="Test" />)
            cy.dataCy("stats-compare-card-icon").should("have.length", 20)
        })
    })

    describe("With other compare value", () => {
        describe("Titanic and Airplanes", () => {
            beforeEach(() => {
                cy.mount(<StatsCompareCard type="titanicAirplane" weight={compareTypes["titanicAirplane"].weight * 3} itemName="Test" />)
            })

            it("should display titanics", () => {
                cy.contains(compareTypes["titanicAirplane"].plural).should("be.visible")
            })

            it("should display airplanes when click right button", () => {
                cy.dataCy("stats-compare-card-right").click()
                cy.contains(compareTypes["titanicAirplane"].compareWith!.plural).should("be.visible")
            })

            it("should display titanics when click left button", () => {
                cy.dataCy("stats-compare-card-right").click()
                cy.dataCy("stats-compare-card-left").click()
                cy.contains(compareTypes["titanicAirplane"].plural).should("be.visible")
            })

            it("should disable titanic button when titanics selected", () => {
                cy.contains(compareTypes["titanicAirplane"].plural).should("be.visible")
                cy.dataCy("stats-compare-card-left").should("be.disabled")
            })

            it("should disable airplanes button when airplane selected", () => {
                cy.dataCy("stats-compare-card-right").click()
                cy.contains(compareTypes["titanicAirplane"].compareWith!.plural).should("be.visible")
                cy.dataCy("stats-compare-card-right").should("be.disabled")
            })
        })

        it("should display cars", () => {
            cy.mount(<StatsCompareCard type="carVehicle" weight={100_000_000} itemName="Test" />)
            cy.contains("Cars").should("be.visible")
        })
    })
})

export { }
