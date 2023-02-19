import "../../styles/global.css"
import { Tab } from "./Tab"
import { Tabs } from "./Tabs"

describe("Tab", () => {
	describe("Selected Tab 1", () => {
		beforeEach(() => {
			cy.mount(
				<Tabs selectedTabIndex={0}>
					<Tab title="Tab 1" link="/tab1">
						<p>Tab 1 Content</p>
					</Tab>
					<Tab title="Tab 2" link="/tab2">
						<p>Tab 2 Content</p>
					</Tab>
				</Tabs>
			)
		})

		it("should display tab 1 content", () => {
			cy.contains("Tab 1 Content").should("be.visible")
		})

		it("should disable tab 1 link", () => {
			cy.dataCy("tab-chip-0").should("have.class", "cursor-default")
		})

		it("should have href to tab 2", () => {
			cy.dataCy("tab-link-1").should("have.attr", "href", "/tab2")
		})
	})

	describe("Selected Tab 2", () => {
		beforeEach(() => {
			cy.mount(
				<Tabs selectedTabIndex={1}>
					<Tab title="Tab 1" link="/tab1">
						<p>Tab 1 Content</p>
					</Tab>
					<Tab title="Tab 2" link="/tab2">
						<p>Tab 2 Content</p>
					</Tab>
				</Tabs>
			)
		})

		it("should display tab 2 content", () => {
			cy.contains("Tab 2 Content").should("be.visible")
		})

		it("should disable tab 2 link", () => {
			cy.dataCy("tab-chip-1").should("have.class", "cursor-default")
		})

		it("should have href to tab 1", () => {
			cy.dataCy("tab-link-0").should("have.attr", "href", "/tab1")
		})
	})
})

export {}
