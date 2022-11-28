/// <reference types="cypress" />

Cypress.Commands.add('dataCy', (dataCy, customSelector = "") => {
    cy.get(`[dataCy=${dataCy}]${customSelector}`)
})

Cypress.Commands.add('visitLocalPage', (path = "", options) => {
    cy.visit(`${Cypress.env("BASE_URL")}${path}`, options)
})

Cypress.Commands.add('check404', () => {
    // TODO (Zoe-Bot): Change implementation when 404 page implemented 
    cy.contains('404 - Page not found').should('be.visible')
})

Cypress.Commands.add('checkCurrentActivePage', (activePageNumber) => {
    cy.dataCy(`pagination-button-page-${activePageNumber}`).should('have.class', 'bg-blue-500')
    cy.dataCy(`pagination-button-page-${activePageNumber}`).should('have.class', 'text-white')
})

export { }

