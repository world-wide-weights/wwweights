import "material-symbols"
import "../../styles/global.css"
import { Tooltip } from "./Tooltip"

describe("Tooltip", () => {
  beforeEach(() => {
    cy.mount(<Tooltip content="test tooltip">
      <p>Test</p>
    </Tooltip>)
  })

  it("should show tooltip when hover over element", () => {
    cy.get("p").trigger("mouseover")
    cy.dataCy("tooltip").should("be.visible")
  })
})