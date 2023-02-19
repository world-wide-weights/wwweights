import "../../styles/global.css"
import { ProgressBar } from "./ProgressBar"

describe("Progress Bar", () => {
	it("should show progress in percent", () => {
		cy.mount(<ProgressBar progress={80} />)
		cy.dataCy("progressbar-progress").should("have.attr", "style", "width: 80%;")
	})

	it("should show 100% progress when progress > 100", () => {
		cy.mount(<ProgressBar progress={120} />)
		cy.dataCy("progressbar-progress").should("have.attr", "style", "width: 100%;")
	})

	it("should show range when additional value is set", () => {
		cy.mount(<ProgressBar progress={80} progressAdditional={90} />)
		cy.dataCy("progressbar-additional-progress").should("be.visible")
	})

	it("should show range percentage when additional value is set", () => {
		cy.mount(<ProgressBar progress={80} progressAdditional={90} />)
		cy.dataCy("progressbar-additional-progress").should("have.attr", "style", "width: 90%;")
	})

	it("should show 100% range percentage when additional percentage is > 100", () => {
		cy.mount(<ProgressBar progress={80} progressAdditional={120} />)
		cy.dataCy("progressbar-additional-progress").should("have.attr", "style", "width: 100%;")
	})

	it("should not show range when additional value not set", () => {
		cy.mount(<ProgressBar progress={80} />)
		cy.dataCy("progressbar-additional-progress").should("not.exist")
	})

	it("should not show gradient when isCa is false", () => {
		cy.mount(<ProgressBar progress={80} />)
		cy.dataCy("progressbar-progress").should("not.have.class", "bg-gradient-to-r")
	})

	it("should show gradient when isCa is true", () => {
		cy.mount(<ProgressBar progress={80} isCa />)
		cy.dataCy("progressbar-progress").should("have.class", "bg-gradient-to-r")
	})
})

export {}
