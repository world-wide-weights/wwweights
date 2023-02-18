import contributions from "../../fixtures/profile/contributions.json"

describe("Delete a contribution", () => {
    beforeEach(() => {
        cy.mockProfilePage()
        cy.login({
            route: "/account/profile"
        })
    })

    it("should open delete modal when click trash icon", () => {
        cy.dataCy(`profile-delete-contribution-${contributions.data[0].slug}`).click()
        cy.dataCy("modal-content").should("be.visible")
        cy.dataCy("modal-content").should("contain.text", contributions.data[0].name)
    })

    it("should close delete modal when click cancel button", () => {
        cy.dataCy(`profile-delete-contribution-${contributions.data[0].slug}`).click()
        cy.dataCy("modal-content").should("be.visible")

        cy.dataCy("profile-cancel-button").click()
        cy.dataCy("modal-content").should("not.exist")
    })

    it("should delete item", () => {
        cy.mockDeleteItem()
        cy.dataCy(`profile-delete-contribution-${contributions.data[0].slug}`).click()

        cy.dataCy("reason-dropdown-button").click()
        cy.dataCy("reason-dropdown-option-inappropriate").click()

        cy.mockDeleteItem()
        cy.dataCy("profile-delete-button").click()

        cy.wait("@mockDeleteItem")

        cy.dataCy("modal-content").should("not.exist")
    })
})

export { }

