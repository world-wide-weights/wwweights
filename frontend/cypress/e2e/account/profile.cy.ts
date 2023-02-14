import contributions from "../../fixtures/profile/contributions.json"
import profile from "../../fixtures/profile/me.json"
import statistics from "../../fixtures/profile/statistics.json"

const API_BASE_URL_AUTH = Cypress.env("PUBLIC_API_BASE_URL_AUTH")
const API_BASE_URL_QUERY = Cypress.env("PUBLIC_API_BASE_URL_QUERY")

describe("Profile", () => {
    describe("Basic", () => {
        beforeEach(() => {
            cy.mockProfilePage()

            cy.login("/account/profile")

            cy.wait("@mockContributions")
            cy.wait("@mockProfile")
            cy.wait("@mockProfileStatistics")
        })

        it("should display username", () => {
            cy.dataCy("profile-username").should("contain.text", profile.username)
        })

        it("should display registered since", () => {
            cy.dataCy("profile-registered-since").should("contain.text", new Date(profile.createdAt).toLocaleDateString("en-US"))
        })

        it("should display stats", () => {
            const totalContributions = statistics.count.itemsCreated + statistics.count.itemsUpdated + statistics.count.itemsDeleted
            cy.dataCy("profile-statistics-wrapper").should("be.visible")
            cy.dataCy("profile-statistics-wrapper").should("contain.text", totalContributions)
            cy.dataCy("profile-statistics-wrapper").should("contain.text", statistics.count.itemsCreated)
            cy.dataCy("profile-statistics-wrapper").should("contain.text", statistics.count.itemsUpdated)
            cy.dataCy("profile-statistics-wrapper").should("contain.text", statistics.count.itemsDeleted)
        })

        it("should display contributions", () => {
            cy.dataCy("profile-contributions-wrapper").should("be.visible")
            cy.dataCy("profile-contributions-wrapper").should("contain.text", contributions.data[0].name)
            cy.dataCy("profile-contributions-wrapper").should("contain.text", contributions.data[1].name)
        })
    })

    describe("Empty State", () => {
        beforeEach(() => {
            cy.mockProfilePage(0, false)

            cy.login("/account/profile")

            cy.wait("@mockContributions")
            cy.wait("@mockProfile")
            cy.wait("@mockProfileStatistics")
        })

        it("should display empty state when no contributions", () => {
            cy.dataCy("contributions-empty-state").should("be.visible")
        })

        it("should show stats 0 when no statistics", () => {
            cy.dataCy("profile-statistics-wrapper").should("be.visible")
            cy.dataCy("profile-statistics-wrapper").should("contain.text", "0")
        })
    })

    describe("Loading", () => {
        beforeEach(() => {
            cy.mockProfilePage()

            cy.login("/account/profile")
        })

        it("should display loading", () => {
            cy.dataCy("skeleton-loading").should("be.visible")
        })
    })

    describe("Error", () => {
        it("should display error 500 when contribution failed", () => {
            // Mock Contributions
            cy.intercept("GET", `${API_BASE_URL_QUERY}/items/list*`, {
                body: contributions
            })

            // Mock statistics
            cy.intercept("GET", `${API_BASE_URL_QUERY}/profiles/*/statistics`, {
                body: {}
            })

            // Mock profile
            cy.intercept("GET", `${API_BASE_URL_AUTH}/profile/me`, {
                forceNetworkError: true
            })

            cy.login("/account/profile")

            cy.check500()
        })

        it("should display error 500 when statistics failed", () => {
            // Mock Contributions
            cy.intercept("GET", `${API_BASE_URL_QUERY}/items/list*`, {
                body: contributions
            })

            // Mock statistics
            cy.intercept("GET", `${API_BASE_URL_QUERY}/profiles/*/statistics`, {
                forceNetworkError: true
            })

            // Mock profile
            cy.intercept("GET", `${API_BASE_URL_AUTH}/profile/me`, {
                body: profile
            })

            cy.login("/account/profile")

            cy.check500()
        })

        it("should display error 500 when profile failed", () => {
            // Mock Contributions
            cy.intercept("GET", `${API_BASE_URL_QUERY}/items/list*`, {
                body: contributions
            })

            // Mock statistics
            cy.intercept("GET", `${API_BASE_URL_QUERY}/profiles/*/statistics`, {
                body: statistics
            })

            // Mock profile
            cy.intercept("GET", `${API_BASE_URL_AUTH}/profile/me`, {
                forceNetworkError: true
            })

            cy.login("/account/profile")

            cy.check500()
        })
    })
})

export { }

