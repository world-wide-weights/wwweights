/// <reference types="cypress" />

import sessiondata from "../fixtures/auth/sessiondata.json"
import paginatedItems from "../fixtures/items/list.json"
import paginatedRelatedItems from "../fixtures/items/related.json"
import paginatedSingleItem from "../fixtures/items/single.json"
import itemStatistics from "../fixtures/items/statistics.json"
import paginatedContributions from "../fixtures/profile/contributions.json"
import profileStatistics from "../fixtures/profile/statistics.json"
import paginatedTagsList from "../fixtures/tags/list.json"

const API_BASE_URL_AUTH = Cypress.env("PUBLIC_API_BASE_URL_AUTH")
const API_BASE_URL_QUERY_CLIENT = Cypress.env("PUBLIC_API_BASE_URL_QUERY_CLIENT")
const API_BASE_URL_QUERY_SERVER = Cypress.env("PUBLIC_API_BASE_URL_QUERY_SERVER")
const API_BASE_URL_COMMAND = Cypress.env("PUBLIC_API_BASE_URL_COMMAND")
const PUBLIC_API_BASE_URL_IMAGE = Cypress.env("PUBLIC_API_BASE_URL_IMAGE")
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

Cypress.Commands.add("check500", () => {
    cy.contains("500 - Error on Server Side").should("be.visible")
})

Cypress.Commands.add("checkCurrentActivePage", (activePageNumber) => {
    cy.dataCy(`pagination-button-page-${activePageNumber}`).should("have.class", "bg-blue-500")
    cy.dataCy(`pagination-button-page-${activePageNumber}`).should("have.class", "text-white")
})

Cypress.Commands.add("mockGetRelatedTags", () => {
    cy.intercept("GET", `${API_BASE_URL_QUERY_CLIENT}/tags/related*`, {
        fixture: "tags/related.json"
    }).as("mockGetRelatedTags")
})

Cypress.Commands.add("mockGetTagsList", () => {
    cy.task("nock", {
        hostname: API_BASE_URL_QUERY_SERVER,
        method: "get",
        path: "/tags/list",
        statusCode: 200,
        body: paginatedTagsList,
    })
})

Cypress.Commands.add("mockItemsList", (options) => {
    const body = options?.itemCount || options?.itemCount === 0 ? {
        ...paginatedItems,
        data: paginatedItems.data.slice(0, options.itemCount)
    } : paginatedItems

    cy.task("clearNock")
    cy.task("activateNock")
    cy.task("nock", {
        hostname: API_BASE_URL_QUERY_SERVER,
        method: "get",
        path: "/items/list",
        statusCode: 200,
        body
    })
})

Cypress.Commands.add("mockDiscoverPage", (options) => {
    cy.mockItemsList(options)

    // Mock Statistics
    cy.task("nock", {
        hostname: API_BASE_URL_QUERY_SERVER,
        method: "get",
        path: "/items/statistics",
        statusCode: 200,
        body: itemStatistics,
    })

    cy.mockGetRelatedTags()
})

Cypress.Commands.add("mockSingleWeightPage", () => {
    cy.task("clearNock")

    // Mock items single
    cy.task("activateNock")
    cy.task("nock", {
        hostname: API_BASE_URL_QUERY_SERVER,
        method: "get",
        path: "/items/list",
        statusCode: 200,
        body: paginatedSingleItem
    })

    // Mock items related
    cy.task("nock", {
        hostname: API_BASE_URL_QUERY_SERVER,
        method: "get",
        path: "/items/related",
        statusCode: 200,
        body: paginatedRelatedItems
    })

    cy.mockGetRelatedTags()
})

Cypress.Commands.add("mockLogin", () => {
    cy.intercept("POST", `${API_BASE_URL_AUTH}/auth/login`, {
        fixture: "auth/tokens.json"
    }).as("mockLogin")

    cy.intercept("POST", `${API_BASE_URL_AUTH}/auth/refresh`, {
        fixture: "auth/tokens.json"
    }).as("mockRefresh")
})

Cypress.Commands.add("mockRegister", () => {
    cy.intercept("POST", `${API_BASE_URL_AUTH}/auth/register`, {
        fixture: "auth/tokens.json"
    }).as("mockRegister")

    cy.intercept("POST", `${API_BASE_URL_AUTH}/auth/refresh`, {
        fixture: "auth/tokens.json"
    }).as("mockRefresh")
})

Cypress.Commands.add("mockCreateItem", () => {
    cy.intercept("POST", `${API_BASE_URL_COMMAND}/items/insert`, {
        statusCode: 200,
    }).as("mockCreateItem")
})

Cypress.Commands.add("mockUploadImage", () => {
    cy.intercept("POST", `${PUBLIC_API_BASE_URL_IMAGE}/upload/image`, {
        statusCode: 201,
    }).as("mockUploadImage")
})

Cypress.Commands.add("login", ({ route, visitOptions }) => {
    cy.mockLogin()

    cy.visitLocalPage(route, {
        ...visitOptions,
        onBeforeLoad: (window) => {
            window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sessiondata))
        }
    })
})

Cypress.Commands.add("mockProfilePage", (options) => {
    const body = options?.contribtionsCount || options?.contribtionsCount === 0 ? {
        ...paginatedContributions,
        data: paginatedContributions.data.slice(0, options?.contribtionsCount)
    } : paginatedContributions

    // Mock Contributions
    cy.intercept("GET", `${API_BASE_URL_QUERY_CLIENT}/items/list*`, {
        body
    }).as("mockContributions")

    // Mock statistics
    cy.intercept("GET", `${API_BASE_URL_QUERY_CLIENT}/profiles/*/statistics`, {
        body: options?.hasStatistics ?? true ? profileStatistics : {}
    }).as("mockProfileStatistics")

    // Mock profile
    cy.intercept("GET", `${API_BASE_URL_AUTH}/profile/me`, {
        fixture: "profile/me.json"
    }).as("mockProfile")
})

Cypress.Commands.add("mockSingleItem", () => {
    cy.intercept("GET", `${API_BASE_URL_QUERY_CLIENT}/items/list*`, {
        fixture: "items/single.json"
    }).as("mockSingleItem")
})

Cypress.Commands.add("mockEditItem", () => {
    cy.intercept("POST", `${API_BASE_URL_COMMAND}/items/*/suggest/edit`, {
        statusCode: 200,
    }).as("mockEditItem")
})

Cypress.Commands.add("mockDeleteItem", () => {
    cy.intercept("POST", `${API_BASE_URL_COMMAND}/items/*/suggest/delete`, {
        statusCode: 200,
    }).as("mockDeleteItem")
})

export { }

