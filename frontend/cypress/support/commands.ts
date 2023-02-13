/// <reference types="cypress" />

import sessiondata from "../fixtures/authentication/sessiondata.json"
import paginatedItems from "../fixtures/items/list.json"
import paginatedRelatedItems from "../fixtures/items/related.json"
import paginatedSingleItem from "../fixtures/items/single.json"
import statistics from "../fixtures/items/statistics.json"

const API_BASE_URL_MOCK = Cypress.env("PUBLIC_API_BASE_URL_MOCK")
const API_BASE_URL_AUTH = Cypress.env("PUBLIC_API_BASE_URL_AUTH")
const API_BASE_URL_QUERY = Cypress.env("PUBLIC_API_BASE_URL_QUERY")
const API_BASE_URL_COMMAND = Cypress.env("PUBLIC_API_BASE_URL_COMMAND")
const LOCAL_STORAGE_KEY = "session"

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
    cy.intercept("GET", `${API_BASE_URL_MOCK}/api/query/v1/tags/related`, {
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
        hostname: API_BASE_URL_QUERY,
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
        hostname: API_BASE_URL_QUERY,
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
        hostname: API_BASE_URL_QUERY,
        method: "get",
        path: "/items/list",
        statusCode: 200,
        body: paginatedSingleItem
    })

    // Mock items related
    cy.task("nock", {
        hostname: API_BASE_URL_QUERY,
        method: "get",
        path: "/items/related",
        statusCode: 200,
        body: paginatedRelatedItems
    })

    cy.mockGetRelatedTags()
})

Cypress.Commands.add("mockLogin", () => {
    cy.intercept("POST", `${API_BASE_URL_AUTH}/auth/login`, {
        fixture: "authentication/tokens.json"
    }).as("mockLogin")

    cy.intercept("POST", `${API_BASE_URL_AUTH}/auth/refresh`, {
        fixture: "authentication/tokens.json"
    }).as("mockRefresh")
})

Cypress.Commands.add("mockRegister", () => {
    cy.intercept("POST", `${API_BASE_URL_AUTH}/auth/register`, {
        fixture: "authentication/tokens.json"
    }).as("mockRegister")

    cy.intercept("POST", `${API_BASE_URL_AUTH}/auth/refresh`, {
        fixture: "authentication/tokens.json"
    }).as("mockRefresh")
})

Cypress.Commands.add("mockCreateItem", () => {
    cy.intercept("POST", `${API_BASE_URL_COMMAND}/items`).as("mockCreateItem")
})

Cypress.Commands.add("login", (route) => {
    cy.mockLogin()

    cy.visitLocalPage(route, {
        onBeforeLoad: (win) => {
            win.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sessiondata))
        }
    })
})

export { }

