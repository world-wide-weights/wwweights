import "material-symbols"
import "../../styles/global.css"
import { CompareCard } from "./CompareCard"

const WATER_BOTTLE_WEIGHT = 1_100
const PERSON_WEIGHT = 62_000
const EARTH_WEIGHT = 5.97200000000000062e27
const TITANIC_WEIGHT = 5.231e10

describe("Stats Compare Card", () => {
	describe("Without other compare value", () => {
		it("should display water bottles", () => {
			cy.mount(<CompareCard type="waterBottle" weight={WATER_BOTTLE_WEIGHT} itemName="Test" />)
			cy.contains("Water bottle").should("be.visible")
		})

		it("should display people", () => {
			cy.mount(<CompareCard type="people" weight={PERSON_WEIGHT} itemName="Test" />)
			cy.contains("Person").should("be.visible")
		})

		it("should display earth", () => {
			cy.mount(<CompareCard type="earths" weight={EARTH_WEIGHT} itemName="Test" />)
			cy.contains("Earth").should("be.visible")
		})

		it("should display correct count of icon when < 20", () => {
			cy.mount(<CompareCard type="waterBottle" weight={WATER_BOTTLE_WEIGHT * 3} itemName="Test" />)
			cy.dataCy("stats-compare-card-icon").should("have.length", 3)
		})

		it("should display 20 icons when > 20", () => {
			cy.mount(<CompareCard type="waterBottle" weight={WATER_BOTTLE_WEIGHT * 22} itemName="Test" />)
			cy.dataCy("stats-compare-card-icon").should("have.length", 20)
		})
	})

	describe("With other compare value", () => {
		describe("Airplanes and titanic", () => {
			beforeEach(() => {
				cy.mount(<CompareCard type="airplaneTitanic" weight={TITANIC_WEIGHT * 3} itemName="Test" />)
			})

			it("should display titanics", () => {
				cy.contains("Airplanes").should("be.visible")
			})

			it("should display airplanes when click right button", () => {
				cy.dataCy("stats-compare-card-right").click()
				cy.contains("Titanics").should("be.visible")
			})

			it("should display titanics when click left button", () => {
				cy.dataCy("stats-compare-card-right").click()
				cy.dataCy("stats-compare-card-left").click()
				cy.contains("Airplanes").should("be.visible")
			})

			it("should disable titanic button when titanics selected", () => {
				cy.contains("Airplanes").should("be.visible")
				cy.dataCy("stats-compare-card-left").should("be.disabled")
			})

			it("should disable airplanes button when airplane selected", () => {
				cy.dataCy("stats-compare-card-right").click()
				cy.contains("Titanics").should("be.visible")
				cy.dataCy("stats-compare-card-right").should("be.disabled")
			})
		})

		it("should display cars", () => {
			cy.mount(<CompareCard type="carTruck" weight={100_000_000} itemName="Test" />)
			cy.contains("Cars").should("be.visible")
		})
	})
})

export {}
