import "material-symbols"
import "../../styles/global.css"
import { ItemPreviewList } from "./ItemPreviewList"

describe("ItemPreviewList", () => {
    describe("should display item preview list correct", () => {
        beforeEach(() => { 
            cy.mount(<ItemPreviewList name="Smartphone" slug="smartphone" weight={{ value: 100, isCa: false }} heaviestWeight={{ value: 100, isCa: false }} imageUrl="https://via.placeholder.com/96.png" />)
        })

        it("should display item preview list correct", () => {
            cy.dataCy("item-preview-list").should("be.visible")
        })

        it("should not display weight difference", () => {
            cy.dataCy("div-difference").should("not.exist")
        })
    })

})