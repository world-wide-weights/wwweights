import "material-symbols"
import "../../styles/global.css"
import { ItemListContribute } from "./ItemListContribute"

const props = {
    name: "Smartphone",
    slug: "smartphone",
    weight: {
        value: 100,
        isCa: false
    },
    image: "https://via.placeholder.com/96.png",
}

describe("ItemListContribute", () => {
    describe("Display", () => {
        beforeEach(() => {
            cy.mount(<ul>
                <ItemListContribute {...props} />
            </ul>)
        })

        it("should display item preview grid correct", () => {
            cy.dataCy("itemlistcontribute-wrapper").should("be.visible")
        })

        it("should display item name", () => {
            cy.dataCy("itemlistcontribute-name").should("have.text", props.name)
        })

        it("should display item weight", () => {
            cy.dataCy("itemlistcontribute-weight").should("have.text", props.weight.value + " g")
        })

        it("should display item image", () => {
            cy.dataCy("itemlistcontribute-image").should("be.visible")
        })
    })
})