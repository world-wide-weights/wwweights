
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
})

export { }

