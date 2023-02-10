/// <reference types="cypress" />

import paginatedItems from "../fixtures/items/list.json"
import paginatedRelatedItems from "../fixtures/items/related.json"
import paginatedSingleItem from "../fixtures/items/single.json"
import statistics from "../fixtures/items/statistics.json"

const apiBaseUrlMock = Cypress.env("PUBLIC_API_BASE_URL_MOCK")
const apiBaseUrlQuery = Cypress.env("PUBLIC_API_BASE_URL_QUERY")
const apiBaseUrlCommand = Cypress.env("PUBLIC_API_BASE_URL_COMMAND")
const clientBaseUrl = Cypress.env("CLIENT_BASE_URL")

Cypress.Commands.add("dataCy", (dataCy, customSelector = "") => {
    cy.get(`[datacy=${dataCy}]${customSelector}`)
})

Cypress.Commands.add("visitLocalPage", (path = "", options) => {
    cy.visit(`${Cypress.env("CLIENT_BASE_URL")}${path}`, options)
})

Cypress.Commands.add("check404", () => {
    cy.contains("404 - Page not found").should("be.visible")
})

Cypress.Commands.add("checkCurrentActivePage", (activePageNumber) => {
    cy.dataCy(`pagination-button-page-${activePageNumber}`).should("have.class", "bg-blue-500")
    cy.dataCy(`pagination-button-page-${activePageNumber}`).should("have.class", "text-white")
})

Cypress.Commands.add("mockGetRelatedTags", () => {
    cy.intercept("GET", `${apiBaseUrlQuery}/tags/related`, {
        fixture: "tags/related.json"
    }).as("mockGetRelatedTags")
})

Cypress.Commands.add("mockItemsList", (itemCount?: number) => {
    const body = itemCount || itemCount === 0 ? {
        ...paginatedItems,
        data: paginatedItems.data.slice(0, itemCount)
    } : paginatedItems

    cy.task("clearNock")
    cy.task("activateNock")
    cy.task("nock", {
        hostname: apiBaseUrlQuery,
        method: "get",
        path: "/items/list",
        statusCode: 200,
        body
    })
})

Cypress.Commands.add("mockDiscoverPage", (itemCount?: number) => {
    cy.mockItemsList(itemCount)

    // Mock Statistics
    cy.task("nock", {
        hostname: apiBaseUrlQuery,
        method: "get",
        path: "/items/statistics",
        statusCode: 200,
        body: statistics,
    })

    cy.mockGetRelatedTags()
})

Cypress.Commands.add("mockSingleWeight", () => {
    cy.task("clearNock")

    // Mock items single
    cy.task("activateNock")
    cy.task("nock", {
        hostname: apiBaseUrlQuery,
        method: "get",
        path: "/items/list",
        statusCode: 200,
        body: paginatedSingleItem
    })

    // Mock items related
    cy.task("nock", {
        hostname: apiBaseUrlQuery,
        method: "get",
        path: "/items/related",
        statusCode: 200,
        body: paginatedRelatedItems
    })

    cy.mockGetRelatedTags()
})

Cypress.Commands.add("mockSession", () => {
    cy.intercept("GET", `${clientBaseUrl}/api/auth/session`, {
        fixture: "/authentication/session.json"
    }).as("mockSession")
})

Cypress.Commands.add("mockCredentials", () => {
    cy.intercept("POST", `${clientBaseUrl}/api/auth/callback/credentials?`, {
        url: `${clientBaseUrl}/account/login`
    }).as("mockCredentials")
})

Cypress.Commands.add("mockCreateItem", () => {
    cy.intercept("POST", `${apiBaseUrlCommand}/items`, {
        url: `${clientBaseUrl}/account/login`
    }).as("mockCreateItem")
})

export { }

