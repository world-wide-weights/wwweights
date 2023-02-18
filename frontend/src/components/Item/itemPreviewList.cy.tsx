import "material-symbols"
import "../../styles/global.css"
import { ItemPreviewList } from "./ItemPreviewList"

const props = {
    name: "Smartphone",
    slug: "smartphone",
    weight: {
        value: 100,
        isCa: false
    },
    imageUrl: "https://via.placeholder.com/96.png",
    heaviestWeight: {
        value: 100,
        isCa: false
    }
}

describe("ItemPreviewList", () => {
    describe("should display item preview list", () => {
        beforeEach(() => {
            cy.mount(<ItemPreviewList {...props} />)
        })

        it("should display item name", () => {
            cy.dataCy("itempreviewlist-name").should("have.text", props.name)
        })

        it("should display item weight", () => {
            cy.dataCy("itempreviewlist-weight").should("have.text", props.weight.value + " g")
        })

        it("should display item image", () => {
            cy.dataCy("itempreviewlist-image").should("be.visible")
        })

        it("should not display weight difference", () => {
            cy.dataCy("itempreviewlist-difference").should("not.exist")
        })

        it("should display progressbar", () => {
            cy.dataCy("progressbar-progress").should("be.visible")
        })

        it("should display right percentage of progressbar", () => {
            cy.dataCy("progressbar-progress").should("have.attr", "style", "width: 100%;")
        })
    })

    describe("should display item preview list correct with weight difference", () => {
        const propsDifference = {
            name: "Smartphone",
            slug: "smartphone",
            weight: {
                value: 50,
                isCa: false
            },
            imageUrl: "https://via.placeholder.com/96.png",
            heaviestWeight: {
                value: 100,
                isCa: false
            }
        }

        it("should display weight difference", () => {
            cy.mount(<ItemPreviewList {...propsDifference} difference={50} />)

            cy.dataCy("itempreviewlist-difference").should("be.visible")
        })

        it("should display weight lower difference correct", () => {
            cy.mount(<ItemPreviewList {...propsDifference} difference={-50} />)

            cy.dataCy("itempreviewlist-difference").should("be.visible")
            cy.dataCy("itempreviewlist-difference").should("have.class", "text-red-500")
            cy.dataCy("arrow-icon").should("have.text", "arrow_downward")
        })

        it("should display weight higher difference correct", () => {
            cy.mount(<ItemPreviewList {...propsDifference} difference={50} />)

            cy.dataCy("itempreviewlist-difference").should("be.visible")
            cy.dataCy("itempreviewlist-difference").should("have.class", "text-green-500")
            cy.dataCy("arrow-icon").should("have.text", "arrow_upward")
        })

        it("should display weight difference is 0 correct", () => {
            cy.mount(<ItemPreviewList {...propsDifference} difference={0} />)

            cy.dataCy("itempreviewlist-difference").should("be.visible")
            cy.dataCy("itempreviewlist-difference").should("have.class", "text-gray-500")
            cy.dataCy("arrow-icon").should("have.text", "remove")
        })

        it("should display right percentage of progressbar", () => {
            cy.mount(<ItemPreviewList {...propsDifference} difference={50} />)

            cy.dataCy("progressbar-progress").should("have.attr", "style", "width: 50%;")
        })
    })

    describe("should display selected item correct", () => {
        beforeEach(() => {
            cy.mount(<ItemPreviewList {...props} selectedItem />)
        })

        it("should display bold font", () => {
            cy.dataCy("itempreviewlist-name").should("have.class", "font-bold")
        })

        it("should display item weight blue", () => {
            cy.dataCy("itempreviewlist-weight").should("have.class", "text-blue-500")
        })
    })

    describe("should disable link", () => {
        it("should disable link", () => {
            cy.mount(<ItemPreviewList {...props} disableLink datacy="itempreviewlist-wrapper" />)

            cy.dataCy("itempreviewlist-wrapper").should("have.attr", "href", "#")
            cy.dataCy("itempreviewlist-wrapper").should("have.class", "cursor-default")
        })
    })

    describe("Bug Fix #307 - Wrong percentage when additional weight is smaller than value", () => {
        it("should get display progressbar from value when it's bigger than additionalValue", () => {
            cy.mount(<ItemPreviewList name="Smartphone" slug="smartphone" weight={{ value: 500, isCa: false }} heaviestWeight={{ value: 1000, isCa: false, additionalValue: 0 }} datacy="item-preview-list" disableLink />)

            cy.dataCy("progressbar-progress").should("have.attr", "style", "width: 50%;")
        })
    })
})