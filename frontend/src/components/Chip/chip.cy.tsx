import "../../styles/global.css"
import { Chip } from "./Chip"

describe("Chip", () => {
  describe("Chip as Link", () => {
    it("chip as link should be visible", () => {

      cy.mount(<Chip to="/">Test</Chip>)
  
      cy.get("a").should("be.visible")
    })
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

    it("should not have opacity if disabled & dimOpacityWhenDisabled is false", () => {
      cy.mount(<Chip to="/" disabled dimOpacityWhenDisabled={false}>Test</Chip>)
  
      cy.get("a").should("have.class", "text-opacity-60")
    })
  })

  describe("Chip as Button", () => {
    it("chip as button should be visible", () => {

      cy.mount(<Chip onClick={() => ""}>Test</Chip>)
  
      cy.get("button").should("be.visible")
    })
    it("should display default color", () => {

      cy.mount(<Chip onClick={() => ""}>Test</Chip>)
  
      cy.get("button").should("have.class", "bg-blue-500")
      cy.get("button").should("have.class", "text-blue-600")
    })
  
    it("should display correct color", () => {
      const color = "amber"
  
      cy.mount(<Chip onClick={() => ""} color={"amber"}>Test</Chip>)
  
      cy.get("button").should("have.class", `bg-${color}-500`)
      cy.get("button").should("have.class", `text-${color}-600`)
    })

    it("should have opacity if disabled", () => {
      cy.mount(<Chip onClick={() => ""} disabled>Test</Chip>)
  
      cy.get("button").should("have.class", "text-opacity-60")
    })

    it("should not have opacity if disabled & dimOpacityWhenDisabled is false", () => {
      cy.mount(<Chip onClick={() => ""} disabled dimOpacityWhenDisabled={false}>Test</Chip>)
  
      cy.get("button").should("have.class", "text-opacity-60")
    })
  })
})
