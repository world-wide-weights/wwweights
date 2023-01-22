import "../../styles/global.css"
import { Chip } from "./Chip"

describe("Chip", () => {
  it("should display default color", () => {

    cy.mount(<Chip to="/">Test</Chip>)

    cy.get("a").should("have.class", "bg-blue-500")
    cy.get("a").should("have.class", "text-blue-600")
  })
  
  it("should display correct color", () => {
    const color = "amber"

    cy.mount(<Chip to="/" color={"amber"}>Test</Chip>)

    cy.get("a").should("have.class", `bg-${color}-500`)
    cy.get("a").should("have.class", `text-${color}-600`)
  })

  it("should have opacity if disabled", () => {
    cy.mount(<Chip to="/" disabled>Test</Chip>)

    cy.get("a").should("have.class", "text-opacity-60")
  })
})
