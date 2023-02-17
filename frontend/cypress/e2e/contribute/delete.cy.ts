import contributions from "../../fixtures/profile/contributions.json"

describe("Delete a contribution", () => {
    beforeEach(() => {
        cy.mockProfilePage()
        cy.login("/account/profile")
    })

    it("should open delete modal when click trash icon", () => {
        cy.dataCy(`profile-delete-contribution-${contributions.data[0].slug}`).click()
    })

    it("should delete item", () => {
    })

    it("should close modal after click delete", () => {
    })
})

export { }

