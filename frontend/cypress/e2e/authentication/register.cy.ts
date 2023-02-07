import { routes } from "../../../src/services/routes/routes"

const apiBaseUrl = Cypress.env("PUBLIC_API_BASE_URL_AUTH")

describe("Register", () => {
    beforeEach(() => {
        cy.visitLocalPage(routes.account.register)
    })

    describe("Register Flow - Email and Password", () => {
        it("should register successfull, login user and redirect page", () => {
            // Type credentials
            cy.dataCy("textinput-email-input").type("hello@gmail.com")
            cy.dataCy("textinput-username-input").type("Hello")
            cy.dataCy("textinput-password-input").type("12345678")

            // Mock register
            cy.intercept("POST", `${apiBaseUrl}/register`, {
                fixture: "authentication/register.json"
            }).as("mockRegister")

            // Mock login and session
            cy.mockCredentials()
            cy.mockSession()

            // Register button
            cy.dataCy("register-button").click()

            cy.wait("@mockRegister")
            cy.wait("@mockCredentials")

            // Mock home
            cy.mockItemsList()

            // Check redirect
            cy.url().should("include", routes.home)
        })
    })

    describe("check password text-field", () => {
        it("should hide password", () => {
            cy.dataCy("textinput-password-input").invoke("attr", "type").should("eq", "password")
        })

        it("should show password", () => {
            cy.dataCy("text-input-icon-password").click()
            cy.dataCy("textinput-password-input").invoke("attr", "type").should("eq", "text")
        })
    })
})

export { }

