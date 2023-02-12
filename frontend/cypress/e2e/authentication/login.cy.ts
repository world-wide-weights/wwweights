import { routes } from "../../../src/services/routes/routes"

const clientBaseUrl = Cypress.env("CLIENT_BASE_URL")

describe("Login", () => {
    beforeEach(() => {
        cy.visitLocalPage(routes.account.login)

        // Type credentials
        cy.dataCy("textinput-email-input").type("hello@gmail.com")
        cy.dataCy("textinput-password-input").type("12345678")
    })

    describe("Login Flow - Email and Password", () => {
        it("should login successfull login user and redirect to home page", () => {
            // Mock login requests.
            cy.mockCredentials()
            cy.mockSession()

            // Login
            cy.dataCy("login-button").click()
            cy.wait("@mockCredentials")

            // Mock home
            cy.mockHome()

            // Check for redirect
            cy.url().should("eq", clientBaseUrl + routes.home)
        })
    })

    describe("Fields", () => {
        it("should initial hide password", () => {
            cy.dataCy("textinput-password-input").invoke("attr", "type").should("eq", "password")
        })

        it("should show password when click password icon", () => {
            cy.dataCy("text-input-icon-password").click()
            cy.dataCy("textinput-password-input").invoke("attr", "type").should("eq", "text")
        })
    })
})

export { }

