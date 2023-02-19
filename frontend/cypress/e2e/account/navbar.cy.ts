describe("Navbar", () => {
	it("should not flicker when changing pages", () => {
		cy.mockDiscoverPage()

		cy.visitLocalPage("/weights")

		cy.contains("Discover").should("be.visible")

		cy.mockHome()
		cy.dataCy("navbar-home-link").click()
		cy.contains("Discover", { timeout: 0 }).should("be.visible")
	})
})

export { }

