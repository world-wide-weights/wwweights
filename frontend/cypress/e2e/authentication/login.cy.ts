const clientBaseUrl = Cypress.env("CLIENT_BASE_URL")

describe("Login", () => {
    beforeEach(() => {
        cy.visitLocalPage("/account/login")

        // Type credentials
        cy.dataCy("textinput-email-input").type("hello@gmail.com")
        cy.dataCy("textinput-password-input").type("12345678")
    })

    describe("Login Flow - Email and Password", () => {
        it("should login successfull login user and redirect to home page", () => {
            // Mock login
            cy.mockLogin()

            // Login
            cy.dataCy("login-button").click()
            cy.wait("@mockLogin")

            // Mock home
            cy.mockItemsList()

            // Check for redirect
            cy.url().should("eq", clientBaseUrl + "/")
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

