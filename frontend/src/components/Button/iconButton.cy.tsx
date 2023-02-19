import "material-symbols"
import "../../styles/global.css"
import { IconButton } from "./IconButton"

const DIMMED_CSS_CLASS = "text-opacity-50"

describe("IconButton", () => {
	describe("Button with onClick", () => {
		it("should display component", () => {
			cy.mount(<IconButton icon="menu" onClick={() => ""} />)

			cy.get("button").should("be.visible")
		})

		it("should display icon", () => {
			cy.mount(<IconButton icon="menu" onClick={() => ""} />)

			cy.get("button i").should("be.visible")
		})

		it("should have hover effect", () => {
			cy.mount(<IconButton icon="menu" onClick={() => ""} />)
			cy.get("button").trigger("mouseover")

			cy.get("button").should("have.class", "hover:bg-gray-200")
		})

		it("should be disabled", () => {
			cy.mount(<IconButton icon="menu" disabled onClick={() => ""} />)

			cy.get("button").should("be.disabled")
		})

		it("should be dimmed when disabled", () => {
			cy.mount(<IconButton icon="menu" disabled onClick={() => ""} />)

			cy.get("i").should("have.class", DIMMED_CSS_CLASS)
		})

		it("should not be dimmed when flag is set", () => {
			cy.mount(<IconButton icon="menu" disabled dimOpacityWhenDisabled={false} onClick={() => ""} />)

			cy.get("i").should("not.have.class", DIMMED_CSS_CLASS)
		})
	})

	describe("Button as link", () => {
		it("should display component", () => {
			cy.mount(<IconButton icon="menu" to="/weights" />)

			cy.get("a").should("be.visible")
		})

		it("should display icon", () => {
			cy.mount(<IconButton icon="menu" to="/weights" />)

			cy.get("a i").should("be.visible")
		})

		it("should have hover effect", () => {
			cy.mount(<IconButton icon="menu" to="/weights" />)
			cy.get("a").trigger("mouseover")

			cy.get("a").should("have.class", "hover:bg-gray-200")
		})

		it("should be disabled", () => {
			cy.mount(<IconButton icon="menu" disabled to="/weights" />)

			cy.get("a").should("have.class", "cursor-default")
		})

		it("should be dimmed when disabled", () => {
			cy.mount(<IconButton icon="menu" disabled to="/weights" />)

			cy.get("i").should("have.class", DIMMED_CSS_CLASS)
		})

		it("should not be dimmed when flag is set", () => {
			cy.mount(<IconButton icon="menu" disabled dimOpacityWhenDisabled={false} to="/weights" />)

			cy.get("i").should("not.have.class", DIMMED_CSS_CLASS)
		})
	})
})

export {}
