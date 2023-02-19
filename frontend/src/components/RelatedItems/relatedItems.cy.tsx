import "material-symbols"
import relatedItems from "../../../cypress/fixtures/items/related.json"
import item from "../../../cypress/fixtures/items/single.json"
import "../../styles/global.css"
import { RelatedItems } from "./RelatedItems"

describe("Related Items", () => {
	beforeEach(() => {
		cy.mount(<RelatedItems relatedItems={relatedItems.data} item={item.data[0]} />)
	})

	it("should display all related items", () => {
		cy.dataCy("related-items-item").should("have.length", relatedItems.data.length)
	})

	it("should display item", () => {
		cy.dataCy("related-items-item-current").should("be.visible")
	})
})

export {}
