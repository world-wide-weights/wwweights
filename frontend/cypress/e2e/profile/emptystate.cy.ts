describe("Empty State Profile", () => {
    beforeEach(() => {
        cy.mockProfilePage({
            contribtionsCount: 0,
            hasStatistics: false
        })

        cy.login({
            route: "/account/profile"
        })

        cy.wait("@mockContributions")
        cy.wait("@mockProfile")
        cy.wait("@mockProfileStatistics")
    })

    it("should display empty state when no contributions", () => {
        cy.dataCy("contributions-empty-state").should("be.visible")
    })

    it("should show stats 0 when no statistics", () => {
        cy.dataCy("profile-statistics-wrapper").should("be.visible")
        cy.dataCy("profile-statistics-wrapper").should("contain.text", "0")
    })
})

export { }

