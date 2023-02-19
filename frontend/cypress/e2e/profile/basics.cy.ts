import contributions from "../../fixtures/profile/contributions.json"
import profile from "../../fixtures/profile/me.json"
import statistics from "../../fixtures/profile/statistics.json"

describe("Profile Basics", () => {
	describe("Basic", () => {
		beforeEach(() => {
			cy.mockProfilePage()

			cy.login({
				route: "/account/profile",
			})

			cy.wait("@mockContributions")
			cy.wait("@mockProfile")
			cy.wait("@mockProfileStatistics")
		})

		it("should display username", () => {
			cy.dataCy("profile-username").should("contain.text", profile.username)
		})

		it("should display registered since", () => {
			cy.dataCy("profile-registered-since").should("contain.text", new Date(profile.createdAt).toLocaleDateString("en-US"))
		})

		it("should display stats", () => {
			const totalContributions = statistics.count.itemsCreated + statistics.count.itemsUpdated + statistics.count.itemsDeleted
			cy.dataCy("profile-statistics-wrapper").should("be.visible")
			cy.dataCy("profile-statistics-wrapper").should("contain.text", totalContributions)
			cy.dataCy("profile-statistics-wrapper").should("contain.text", statistics.count.itemsCreated)
			cy.dataCy("profile-statistics-wrapper").should("contain.text", statistics.count.itemsUpdated)
			cy.dataCy("profile-statistics-wrapper").should("contain.text", statistics.count.itemsDeleted)
		})

		it("should display contributions", () => {
			cy.dataCy("profile-contributions-wrapper").should("be.visible")
			cy.dataCy("profile-contributions-wrapper").should("contain.text", contributions.data[0].name)
			cy.dataCy("profile-contributions-wrapper").should("contain.text", contributions.data[1].name)
		})
	})

	describe("Loading", () => {
		beforeEach(() => {
			cy.mockProfilePage()

			cy.login({
				route: "/account/profile",
			})
		})

		it("should display loading", () => {
			cy.dataCy("skeleton-loading").should("be.visible")
		})
	})
})

export {}
