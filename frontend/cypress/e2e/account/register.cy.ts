
const API_BASE_URL_AUTH = Cypress.env("PUBLIC_API_BASE_URL_AUTH")

describe("Register", () => {
    beforeEach(() => {
        cy.visitLocalPage("/account/register")
    })

    describe("Register Flow - Email and Password", () => {
        it("should register successfull and redirect page", () => {
            // Type credentials
            cy.dataCy("textinput-email-input").type("hello@gmail.com")
            cy.dataCy("textinput-username-input").type("Hello")
            cy.dataCy("textinput-password-input").type("12345678")

            // Mocks
            cy.mockRegister()

            // Register button
            cy.dataCy("register-button").click()

            cy.wait("@mockRegister")

            // Mock home
            cy.mockHome()

            // Check redirect
            cy.url().should("include", "/")
        })
    })

    describe("check password text-field", () => {
        it("should hide password", () => {
            cy.dataCy("textinput-password-input").should("have.attr", "type", "password")
        })

        it("should show password", () => {
            cy.dataCy("text-input-icon-password").click()
            cy.dataCy("textinput-password-input").should("have.attr", "type", "text")
        })
    })

    describe("Error Handling", () => {
        it("should show error when username already exist", () => {
            // Type credentials
            cy.dataCy("textinput-email-input").type("hello@gmail.com")
            cy.dataCy("textinput-username-input").type("Hello")
            cy.dataCy("textinput-password-input").type("12345678")

            // Mock regiser username already exists
            cy.intercept("POST", `${API_BASE_URL_AUTH}/auth/register`, {
                statusCode: 409, // Conflict
                body: {
                    statusCode: 409,
                    message: "Username already exists",
                },
            }).as("mockRegisterUsernameDuplicate")

            // Register
            cy.dataCy("register-button").click()
            cy.wait("@mockRegisterUsernameDuplicate")

            cy.dataCy("formerror-username").should("be.visible")
            cy.dataCy("formerror-username").contains("Username already exists")
        })

        it("should show error when email already exist", () => {
            // Type credentials
            cy.dataCy("textinput-email-input").type("hello@gmail.com")
            cy.dataCy("textinput-username-input").type("Hello")
            cy.dataCy("textinput-password-input").type("12345678")

            // Mock regiser username already exists
            cy.intercept("POST", `${API_BASE_URL_AUTH}/auth/register`, {
                statusCode: 409, // Conflict
                body: {
                    statusCode: 409,
                    message: "Email already in use",
                },
            }).as("mockRegisterEmailDuplicate")

            // Register
            cy.dataCy("register-button").click()
            cy.wait("@mockRegisterEmailDuplicate")

            cy.dataCy("formerror-email").should("be.visible")
            cy.dataCy("formerror-email").contains("E-Mail already in use.")
        })
    })
})

export { }

