describe('View Type Grid/List /weights', () => {
    beforeEach(() => {
        cy.mockWeightsPage()

        cy.visitLocalPage(`/weights`)
        cy.wait('@mockGetRelatedTags')
    })

    it('should change view type to list view when click on list view', () => {
        cy.dataCy("weights-grid-item").should('be.visible')

        cy.dataCy("discover-grid-list-button").click()
        cy.dataCy("weights-list-item").should('be.visible')
    })

    it('should change view type to grid view when click on grid view', () => {
        // View Type List
        cy.dataCy("discover-grid-list-button").click()
        cy.dataCy("weights-list-item").should('be.visible')

        cy.dataCy("discover-grid-view-button").click()
        cy.dataCy("weights-grid-item").should('be.visible')
    })
})

export { }

