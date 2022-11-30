import '../../styles/global.css';
import 'material-symbols';
import { IconButton } from "./IconButton";

describe('iconButton.cy.ts', () => {
  it('should display component', () => {
    cy.mount(<IconButton icon='menu' onClick={() => ""}/>)
  })
})

export { };