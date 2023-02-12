import { routes } from "../../../src/services/routes/routes"

const clientBaseUrl = Cypress.env("CLIENT_BASE_URL")

describe("Routes protected/guest", () => {
    it("should not redirect when nothing is set (on /)", () => {
        cy.mockItemsList()

        cy.visitLocalPage(routes.home)

        cy.url().should("eq", clientBaseUrl + routes.home)
    })

    describe("Protected Route", () => {
        it("should redirect to login when not logged in", () => {
            cy.visitLocalPage(routes.account.profile())

            cy.url().should("include", routes.account.login)
        })

        it("should show page when logged in", () => {
            cy.visitLocalPage(routes.account.profile())

            // "Login"
            cy.mockSession()
            cy.wait("@mockSession")

            cy.url().should("include", routes.account.profile())
        })
    })

    describe("Guest Route", () => {
        it("should redirect to / when logged in and visit login (guest route)", () => {
            // Guest route
            cy.visitLocalPage(routes.account.login)

            // "Login"
            cy.mockSession()
            cy.wait("@mockSession")

            // Mock home
            cy.mockHome()

            // Redirected to /
            cy.url().should("eq", clientBaseUrl + routes.home)
        })

        it("should show page (login guest route) when not logged in", () => {
            // Guest route
            cy.visitLocalPage(routes.account.login)

            // Stays on login
            cy.url().should("include", routes.account.login)
        })
    })
})

export { }

