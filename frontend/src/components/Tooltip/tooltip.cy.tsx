import "material-symbols"
import "../../styles/global.css"
import { Tooltip } from "./Tooltip"

describe("Tooltip", () => {
    describe("Base", () => {
        beforeEach(() => {
            cy.mount(<Tooltip position="right" content="test tooltip">
                <p>Test</p>
            </Tooltip>)
        })

        it("should hide tooltip on default", () => {
            cy.dataCy("tooltip").should("not.exist")
        })

        it("should show correct tooltip content", () => {
            cy.get("p").trigger("mouseover")

            cy.dataCy("tooltip").should("contain", "test tooltip")
        })

        it("should show tooltip when hover over element", () => {
            cy.get("p").trigger("mouseover")
            cy.dataCy("tooltip").should("be.visible")
        })
    })
})