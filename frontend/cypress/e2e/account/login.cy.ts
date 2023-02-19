const CLIENT_BASE_URL = Cypress.env("CLIENT_BASE_URL")
const API_BASE_URL_AUTH = Cypress.env("PUBLIC_API_BASE_URL_AUTH")

describe("Login Page", () => {
	describe("Login", () => {
		beforeEach(() => {
			cy.visitLocalPage("/account/login")

			// Type credentials
			cy.dataCy("textinput-email-input").type("hello@gmail.com")
			cy.dataCy("textinput-password-input").type("12345678")
		})

		describe("Login Flow - Email and Password", () => {
			it("should login successfull login user and redirect to home page", () => {
				// Mocks
				cy.mockLogin()
				cy.mockHome()

				// Login
				cy.dataCy("login-button").click()
				cy.wait("@mockLogin")

				// Check for redirect (add custom time since ci seems to be to slow)
				cy.url({
					timeout: 10000,
				}).should("eq", CLIENT_BASE_URL + "/")
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

		describe("Error Handling", () => {
			it("should show error toast when login fails", () => {
				// Mock login unauthorized
				cy.intercept("POST", `${API_BASE_URL_AUTH}/auth/login`, {
					statusCode: 401, // Unauthorized,
					body: {
						statusCode: 401,
						message: "Unauthorized",
					},
				}).as("mockLoginUnauthorized")

				// Login
				cy.dataCy("login-button").click()
				cy.wait("@mockLoginUnauthorized")

				cy.contains("Login").should("be.visible")

				// Check for toast
				cy.contains("Wrong E-Mail or Password.").should("be.visible")
			})
		})
	})

	describe("Logout", () => {
		it("should show logout toast when you logout successfully", () => {
			// Mock login
			cy.login({
				route: "/",
			})

			// Logout
			cy.contains("Logout").click()

			// Check for toast
			cy.contains("You have been logged out.").should("be.visible")
		})
	})
})

export {}
