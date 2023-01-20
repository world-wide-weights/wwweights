import { routes } from "../../../src/services/routes/routes"
import singleItem from "../../fixtures/items/single.json"

describe("Single Weight Tabs", () => {
    describe("Routing", () => {
        it.skip("should display overview when url without tab query", () => {
            cy.mockSingleWeight()
            cy.visitLocalPage(routes.weights.single(singleItem.slug))

            // TODO (Zoe-Bot): Test when overview component is there 
        })

        it.skip("should display similar items tab when url with tab similar items", () => {
            cy.mockSingleWeight()
            cy.visitLocalPage(routes.weights.single(singleItem.slug, { tab : "similar-items" }))

            // TODO (Zoe-Bot): Test when similar items component is there 
        })

        it("should display 404 when url with tab that does not exist", () => {
            cy.mockSingleWeight()
            cy.visitLocalPage(routes.weights.single(singleItem.slug, { tab : "this-tab-does-not-exist" }))

            cy.check404()
        })
    })
})

export { }

