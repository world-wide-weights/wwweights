import '../../styles/global.css';
import { Headline, textSizes } from "./Headline";

const LEVEL = 2

describe('Headline', () => {
  describe('Mount default', () => {
    beforeEach(() => {
      cy.mount(<Headline level={LEVEL}>Test</Headline>)
    })

    it('should display correct tag when set level', () => {
      cy.contains(`h${LEVEL}`, "Test").should('be.visible')
    })

    it('should display correct class when set level', () => {
      cy.get(`h${LEVEL}`).should('have.class', textSizes[LEVEL])
    })

    it('should display margin when set hasMargin is set to true', () => {
      cy.get(`h${LEVEL}`).should('have.class', 'mb-2 md:mb-4')
    })
  })

  it('should display no margin when set hasMargin is set to false', () => {
    cy.mount(<Headline level={LEVEL} hasMargin={false}>Test</Headline>)
    cy.get(`h${LEVEL}`).should('not.have.class', 'mb-2 md:mb-4')
  })
})

export { };

