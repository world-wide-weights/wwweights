import "material-symbols"
import "../../styles/global.css"
import { ItemPreviewGrid, ItemPreviewGridProps } from "./ItemPreviewGrid"

const props: ItemPreviewGridProps = {
    name: "Smartphone",
    slug: "smartphone",
    weight: {
        value: 100,
        isCa: false
    },
    imageUrl: "https://via.placeholder.com/96.png",
}

describe("ItemPreviewGrid", () => {
    describe("should display item preview grid correct", () => {
        beforeEach(() => {
            cy.mount(<ItemPreviewGrid {...props} />)
        })

        it("should display item name", () => {
            cy.dataCy("itempreviewgrid-name").should("have.text", props.name)
        })

        it("should display item weight", () => {
            cy.dataCy("itempreviewgrid-weight").should("have.text", props.weight.value + " g")
        })

        it("should display item image", () => {
            cy.dataCy("itempreviewgrid-image").should("be.visible")
        })
    })
})