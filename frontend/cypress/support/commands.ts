/// <reference types="cypress" />

import items from "../fixtures/items/list.json"
import statistics from "../fixtures/items/statistics.json"

const apiBaseUrl = Cypress.env("API_BASE_URL")

Cypress.Commands.add('dataCy', (dataCy, customSelector = "") => {
    cy.get(`[datacy=${dataCy}]${customSelector}`)
})

Cypress.Commands.add('visitLocalPage', (path = "", options) => {
    cy.visit(`${Cypress.env("CLIENT_BASE_URL")}${path}`, options)
})

Cypress.Commands.add('check404', () => {
    cy.contains('404 - Page not found').should('be.visible')
})

Cypress.Commands.add('checkCurrentActivePage', (activePageNumber) => {
    cy.dataCy(`pagination-button-page-${activePageNumber}`).should('have.class', 'bg-blue-500')
    cy.dataCy(`pagination-button-page-${activePageNumber}`).should('have.class', 'text-white')
})

Cypress.Commands.add('mockGetRelatedTags', () => {
    cy.intercept('GET', `${apiBaseUrl}/api/query/v1/tags/related`, {
        fixture: 'tags/related.json'
    }).as('mockGetRelatedTags')
})

Cypress.Commands.add('mockWeightsPage', () => {
    cy.task('clearNock')
    cy.task('activateNock')
    cy.task('nock', {
        hostname: apiBaseUrl,
        method: 'get',
        path: `/api/query/v1/items/list`,
        statusCode: 200,
        body: items,
    })

    cy.task('nock', {
        hostname: apiBaseUrl,
        method: 'get',
        path: `/api/query/v1/items/statistics`,
        statusCode: 200,
        body: statistics,
    })

    cy.mockGetRelatedTags()
})

export { }

