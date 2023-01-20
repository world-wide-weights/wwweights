import { routes } from "../../../src/services/routes/routes"
import singleItem from "../../fixtures/items/single.json"

describe("Single Weight Tabs", () => {
    describe("Routing", () => {
        beforeEach(() => {
            cy.mockSingleWeight()
            cy.visitLocalPage(routes.weights.single(singleItem.slug))
        })

        it("should display overview when url without tab query", () => {

        })

        it("should display similar items tab when url with tab similar items", () => {

        })

        it("should display 404 when url with tab that does not exist", () => {

        })
    })
})

export { }

