import "material-symbols"
import "../../styles/global.css"
import { ItemListContribute } from "./ItemListContribute"

describe("ItemListContribute", () => {
    describe("should display item list contribute correct", () => {
        beforeEach(() => {
            cy.mount(<ItemListContribute name="Smartphone" slug="smartphone" weight={{ value: 100, isCa: false }} image="https://via.placeholder.com/96.png" />)
        })

        it("should display item preview grid correct", () => {
            cy.dataCy("item-list-contribute").should("be.visible")
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

    describe("should display actions correct", () => {
        beforeEach(() => {
            cy.mount(<ItemListContribute name="Smartphone" slug="smartphone" weight={{ value: 100, isCa: false }} image="https://via.placeholder.com/96.png" />)
        })

        it("should display edit action", () => {
            cy.dataCy("edit-action").should("be.visible")
        })  

        it("should display delete action", () => {
            cy.dataCy("delete-action").should("be.visible")
        })
    })


})