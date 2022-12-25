/// <reference types="cypress" />

const apiBaseUrl = Cypress.env("API_URL")

Cypress.Commands.add('dataCy', (dataCy, customSelector = "") => {
    cy.get(`[datacy=${dataCy}]${customSelector}`)
})

Cypress.Commands.add('visitLocalPage', (path = "", options) => {
    cy.visit(`${Cypress.env("BASE_URL")}${path}`, options)
})

Cypress.Commands.add('check404', () => {
    cy.contains('404 - Page not found').should('be.visible')
})

Cypress.Commands.add('checkCurrentActivePage', (activePageNumber) => {
    cy.dataCy(`pagination-button-page-${activePageNumber}`).should('have.class', 'bg-blue-500')
    cy.dataCy(`pagination-button-page-${activePageNumber}`).should('have.class', 'text-white')
})

Cypress.Commands.add('getRelatedTags', () => {
    cy.intercept('GET', `${apiBaseUrl}/api/query/v1/tags/related`, {
        fixture: 'tags/related.json'
    }).as('getRelatedTags')
})

export { }

