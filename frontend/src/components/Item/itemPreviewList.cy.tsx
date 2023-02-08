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

        it("should display item name", () => {
            cy.dataCy("item-name").should("have.text", "Smartphone")
        })

        it("should not display weight difference", () => {
            cy.dataCy("div-difference").should("not.exist")
        })
    })

    describe("should display item preview list correct with weight difference", () => {
        it("should display weight difference", () => {
            cy.mount(<ItemPreviewList name="Smartphone" slug="smartphone" weight={{ value: 100, isCa: false }} heaviestWeight={{ value: 200, isCa: false }} imageUrl="https://via.placeholder.com/96.png" difference={50} />)

            cy.dataCy("div-difference").should("be.visible")
        })

        it("should display weight lower difference correct", () => {
            cy.mount(<ItemPreviewList name="Smartphone" slug="smartphone" weight={{ value: 100, isCa: false }} heaviestWeight={{ value: 200, isCa: false }} imageUrl="https://via.placeholder.com/96.png" difference={-50} />)

            cy.dataCy("div-difference").should("be.visible")
            cy.dataCy("div-difference").should("have.class", "text-red-500")
            cy.dataCy("arrow-icon").should("have.text", "arrow_downward")
        })

        it("should display weight higher difference correct", () => {
            cy.mount(<ItemPreviewList name="Smartphone" slug="smartphone" weight={{ value: 100, isCa: false }} heaviestWeight={{ value: 200, isCa: false }} imageUrl="https://via.placeholder.com/96.png" difference={50} />)

            cy.dataCy("div-difference").should("be.visible")
            cy.dataCy("div-difference").should("have.class", "text-green-500")
            cy.dataCy("arrow-icon").should("have.text", "arrow_upward")
        })

        it("should display weight difference is 0 correct", () => {
            cy.mount(<ItemPreviewList name="Smartphone" slug="smartphone" weight={{ value: 100, isCa: false }} heaviestWeight={{ value: 200, isCa: false }} imageUrl="https://via.placeholder.com/96.png" difference={0} />)

            cy.dataCy("div-difference").should("be.visible")
            cy.dataCy("div-difference").should("have.class", "text-gray-500")
            cy.dataCy("arrow-icon").should("have.text", "remove")
        })
    })

    describe("should display selected item correct", () => {
        beforeEach(() => { 
            cy.mount(<ItemPreviewList name="Smartphone" slug="smartphone" weight={{ value: 100, isCa: false }} heaviestWeight={{ value: 100, isCa: false }} imageUrl="https://via.placeholder.com/96.png" selectedItem/>)
        })

        it("should display bold font", () => {
            cy.dataCy("item-name").should("have.class", "font-bold")
        })

        it("should display item name blue", () => {
            cy.dataCy("compared-weight-text").should("have.class", "text-blue-500")
        })

    })




})