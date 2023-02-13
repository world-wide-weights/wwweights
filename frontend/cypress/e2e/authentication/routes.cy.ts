
const clientBaseUrl = Cypress.env("CLIENT_BASE_URL")

describe("Routes protected/guest", () => {
    describe("Protected Route", () => {
        it("should redirect to login when not logged in", () => {
            // Visit profile
            cy.visitLocalPage("/account/profile")

            // Should be at login
            cy.contains("Welcome back").should("be.visible")
            cy.url().should("include", "/account/login")
        })

        it("should show page when logged in", () => {
            // Login and visit profile
            cy.login("/account/profile")

            // Should be at profile
            cy.url().should("include", "/account/profile")
            cy.contains("Profile").should("be.visible")
        })
    })

    describe("Guest Route", () => {
        it("should redirect to / when logged in and visit login (guest route)", () => {
            // Login and visit login page
            cy.login("/account/login")

            // Mock home
            cy.mockHome()

            // Redirected to /
            cy.url().should("eq", clientBaseUrl + "/")
            cy.contains("How much weighs?").should("be.visible")
        })

        it("should show page (login guest route) when not logged in", () => {
            // Guest route
            cy.visitLocalPage("/account/login")

            // Stays on login
            cy.url().should("include", "/account/login")
        })

        it("should not show profile when guest", () => {
            // Visit profile
            cy.visitLocalPage("/account/profile")

            // Should never see profile
            cy.contains("Profile", { timeout: 0 }).should("not.exist")
        })
    })

    describe("Public Route", () => {
        it("should show page when logged in", () => {
            // Mock home
            cy.mockItemsList()

            // Login and visit home page
            cy.login("/")

            // Should be at home
            cy.url().should("eq", clientBaseUrl + "/")
            cy.contains("How much weighs?").should("be.visible")
        })

        it("should show page when guest", () => {
            // Mock home
            cy.mockItemsList()

            // Visit home page
            cy.visitLocalPage("/")

            // Should be at home
            cy.url().should("eq", clientBaseUrl + "/")
            cy.contains("How much weighs?").should("be.visible")
        })
    })
})

export { }

