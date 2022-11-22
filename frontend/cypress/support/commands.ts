/// <reference types="cypress" />

Cypress.Commands.add('dataCy', (dataCy, customSelector = "") => {
    cy.get(`[dataCy=${dataCy}]${customSelector}`)
})

export { }

