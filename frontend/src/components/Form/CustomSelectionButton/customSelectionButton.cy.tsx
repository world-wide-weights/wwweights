import { CustomSelectionButton } from "./CustomSelectionButton"

describe("CustomSelectionButton component", () => {
    describe("Acitve is false", () => {
        beforeEach(() => {
            cy.mount(<CustomSelectionButton
                active={false}
                onClick={cy.spy().as("onClick")}
                headline="Button headline"
                description="Button description"
                datacy="custom-selection-button"
            />)
        })

        it("should render with the correct headline and description", () => {
            cy.dataCy("custom-selection-button").should("contain", "Button headline")
            cy.dataCy("custom-selection-button").should("contain", "Button description")
        })

        it("should call onClick when clicked", () => {
            cy.dataCy("custom-selection-button").click()
            cy.get("@onClick").should("have.been.called")
        })

        it("should not display icon when active is false", () => {
            cy.dataCy("custom-selection-button").should("not.contain", "check")
        })
    })

    describe("Active is true", () => {
        beforeEach(() => {
            cy.mount(<CustomSelectionButton
                active={true}
                onClick={cy.spy().as("onClick")}
                headline="Button headline"
                description="Button description"
                datacy="custom-selection-button"
            />)
        })

        it("should render with the correct headline and description", () => {
            cy.dataCy("custom-selection-button").should("contain", "Button headline")
            cy.dataCy("custom-selection-button").should("contain", "Button description")
        })

        it("should display icon when active is true", () => {
            cy.dataCy("custom-selection-button").should("contain", "check")
        })

        it("should not call onClick when clicked", () => {
            cy.dataCy("custom-selection-button").click({ force: true })
            cy.get("@onClick").should("not.have.been.called")
        })
    })
})