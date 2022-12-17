import '../../styles/global.css';
import 'material-symbols';
import { IconButton } from "./IconButton";

describe('IconButton', () => {
    describe('Button with onClick', () => {
        it('should display component', () => {
          cy.mount(<IconButton icon='menu' onClick={() => ""}/>)
          cy.get('button')
        })
        it('should display icon', () => {
          cy.mount(<IconButton icon='menu' onClick={() => ""}/>)
          cy.get('button i').should('be.visible')
        })
      })

    describe('Button as link', () => {
      it('should display component', () => {
        cy.mount(<IconButton icon='menu' to=''/>)
        cy.get('button')
      })
      it('should display icon', () => {
        cy.mount(<IconButton icon='menu' to=''/>)
        cy.get('button i').should('be.visible')
      })
    })

})


export { };