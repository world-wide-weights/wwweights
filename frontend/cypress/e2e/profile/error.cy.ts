import contributions from "../../fixtures/profile/contributions.json"
import profile from "../../fixtures/profile/me.json"
import statistics from "../../fixtures/profile/statistics.json"

const API_BASE_URL_AUTH = Cypress.env("PUBLIC_API_BASE_URL_AUTH")
const API_BASE_URL_QUERY_CLIENT = Cypress.env("NEXT_PUBLIC_API_BASE_URL_QUERY_CLIENT")

describe("Error Profile", () => {
    it("should display error 500 when contribution failed", () => {
        // Mock Contributions
        cy.intercept("GET", `${API_BASE_URL_QUERY_CLIENT}/items/list*`, {
            body: contributions
        })

        // Mock statistics
        cy.intercept("GET", `${API_BASE_URL_QUERY_CLIENT}/profiles/*/statistics`, {
            body: {}
        })

        // Mock profile
        cy.intercept("GET", `${API_BASE_URL_AUTH}/profile/me`, {
            forceNetworkError: true
        })

        cy.login({
            route: "/account/profile"
        })

        cy.check500()
    })

    it("should display error 500 when statistics failed", () => {
        // Mock Contributions
        cy.intercept("GET", `${API_BASE_URL_QUERY_CLIENT}/items/list*`, {
            body: contributions
        })

        // Mock statistics
        cy.intercept("GET", `${API_BASE_URL_QUERY_CLIENT}/profiles/*/statistics`, {
            forceNetworkError: true
        })

        // Mock profile
        cy.intercept("GET", `${API_BASE_URL_AUTH}/profile/me`, {
            body: profile
        })

        cy.login({
            route: "/account/profile"
        })

        cy.check500()
    })

    it("should display error 500 when profile failed", () => {
        // Mock Contributions
        cy.intercept("GET", `${API_BASE_URL_QUERY_CLIENT}/items/list*`, {
            body: contributions
        })

        // Mock statistics
        cy.intercept("GET", `${API_BASE_URL_QUERY_CLIENT}/profiles/*/statistics`, {
            body: statistics
        })

        // Mock profile
        cy.intercept("GET", `${API_BASE_URL_AUTH}/profile/me`, {
            forceNetworkError: true
        })

        cy.login({
            route: "/account/profile"
        })

        cy.check500()
    })
})

export { }

