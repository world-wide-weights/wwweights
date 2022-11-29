import '../../styles/global.css';
import { Headline } from "./Headline";

describe('headline.cy.ts', () => {
  it('should display component', () => {
    cy.mount(<Headline>Test</Headline>)
  })
})

export { };

