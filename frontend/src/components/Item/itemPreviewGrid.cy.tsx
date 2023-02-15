import "material-symbols"
import "../../styles/global.css"
import { ItemPreviewGrid } from "./ItemPreviewGrid"

describe("ItemPreviewGrid", () => {
    describe("should display item preview grid correct", () => {
        beforeEach(() => {
            cy.mount(<ItemPreviewGrid name="Smartphone" slug="smartphone" weight={{ value: 100, isCa: false }} imageUrl="https://via.placeholder.com/96.png" datacy="item-preview-grid" />)
        })

        it("should display item preview grid correct", () => {
            cy.dataCy("item-preview-grid").should("be.visible")
        })

        it("should display item name", () => {
            cy.dataCy("item-name").should("have.text", "Smartphone")
        })

        it("should display item weight", () => {
            cy.dataCy("item-weight").should("have.text", "100 g")
        })

        it("should display item image", () => {
            cy.dataCy("item-image").should("be.visible")
        })
    })
})