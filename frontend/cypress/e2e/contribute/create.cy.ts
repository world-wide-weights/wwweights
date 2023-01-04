import { routes } from "../../../src/services/routes/routes"

describe('Create Item', () => {
    beforeEach(() => {
        cy.mockSession()

        cy.visitLocalPage(routes.contribute.create)

        cy.wait('@mockSession')
    })

    it('should create item when fill all required fields', () => {
        // Fill all required
        cy.dataCy('textinput-name-input').type('apple')
        cy.dataCy('textinput-weight-input').type('150')

        // Mock create and weights page
        cy.mockCreateItem()
        cy.mockWeightsPage()

        // Submit form
        cy.dataCy('create-submit-button').click()

        cy.wait('@mockCreateItem')
    })

    it('should create item when fill all fields', () => {
        // Fill required
        cy.dataCy('textinput-name-input').type('apple')
        cy.dataCy('textinput-weight-input').type('150')

        // Fill Weights
        cy.dataCy('isCa-dropdown-button').click()
        cy.dataCy('isCa-dropdown-option-true').click()

        cy.dataCy('textinput-additionalValue-input').type('300')

        cy.dataCy('unit-dropdown-button').click()
        cy.dataCy('unit-dropdown-option-kg').click()

        // Open details
        cy.dataCy('create-open-details-button').click()

        cy.dataCy('textinput-source-input').type('https://wikipedia.de')
        cy.dataCy('textinput-tags-input').type('fruit')
        cy.dataCy('textinput-image-input').type('https://picsum.photos/120')

        // Mock create and weights page
        cy.mockCreateItem()
        cy.mockWeightsPage()

        // Submit form
        cy.dataCy('create-submit-button').click()

        cy.wait('@mockCreateItem')
    })

    describe('Details', () => {
        it('should open details when click "Add more details"', () => {
            // Open details
            cy.dataCy('create-open-details-button').click()

            cy.dataCy('textinput-source-input').should('be.visible')
        })
    })
})

export { }

