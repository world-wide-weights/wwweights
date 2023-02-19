
const clientBaseUrl = Cypress.env("CLIENT_BASE_URL")

describe("Routes protected/guest", () => {
    describe("Protected Route", () => {
        it("should redirect to login when not logged in", () => {
            // Mock profile
            cy.mockProfilePage()

            // Visit profile
            cy.visitLocalPage("/account/profile")

            // Should be at login
            cy.contains("Welcome back").should("be.visible")
            cy.url().should("include", "/account/login")
        })

        it("should show page when logged in", () => {
            // Mock profile
            cy.mockProfilePage()

            // Login and visit profile
            cy.login({
                route: "/account/profile"
            })

            // Should be at profile
            cy.url().should("include", "/account/profile")
            cy.contains("Profile").should("be.visible")
        })

        it("should show toast when you try to access protected page when logged out", () => {
            cy.mockTagsListClient()

            // Login and visit profile
            cy.visitLocalPage("/account/profile")

            // Check for toast
            cy.contains("You need to be logged in to access this page.").should("be.visible")
        })
    })

    describe("Guest Route", () => {
        it("should redirect to / when logged in and visit login (guest route)", () => {
            // Login and visit login page
            cy.login({
                route: "/account/login"
            })

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
            // Mock profile
            cy.mockProfilePage()

            // Visit profile
            cy.visitLocalPage("/account/profile")

            // Should never see profile
            cy.contains("Profile", { timeout: 0 }).should("not.exist")
        })
    })

    describe("Public Route", () => {
        it("should show page when logged in", () => {
            // Mock home
            cy.mockHome()

            // Login and visit home page
            cy.login({
                route: "/"
            })

            // Should be at home
            cy.url().should("eq", clientBaseUrl + "/")
            cy.contains("How much weighs?").should("be.visible")
        })

        it("should show page when guest", () => {
            // Mock home
            cy.mockHome()

            // Visit home page
            cy.visitLocalPage("/")

            // Should be at home
            cy.url().should("eq", clientBaseUrl + "/")
            cy.contains("How much weighs?").should("be.visible")
        })
    })
})

export { }

