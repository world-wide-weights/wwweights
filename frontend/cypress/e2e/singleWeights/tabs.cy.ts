import { routes } from "../../../src/services/routes/routes"
import singleItem from "../../fixtures/items/single.json"

describe("Single Weight Tabs", () => {
    describe("Routing", () => {
        it("should display overview when url without tab query", () => {
            cy.mockSingleWeight()
            cy.visitLocalPage(routes.weights.single(singleItem.data[0].slug))

            cy.wait("@mockGetRelatedTags")

            cy.contains("Related Items").should("be.visible")
            cy.contains("Compare Items").should("be.visible")
        })

        // This test does not work correct because of https://github.com/world-wide-weights/wwweights/issues/194
        it.skip("should display compare when url with tab compare query", () => {
            cy.mockSingleWeight()
            cy.visitLocalPage(routes.weights.single(singleItem.data[0].slug, { tab: "compare" }))

            cy.wait("@mockGetRelatedTags")

            cy.contains("Pencils").should("be.visible")
        })

        it("should display 404 when url with tab that does not exist", () => {
            cy.mockSingleWeight()
            cy.visitLocalPage(routes.weights.single(singleItem.data[0].slug, { tab: "this-tab-does-not-exist" }))

            cy.check404()
        })
    })
})

export { }

