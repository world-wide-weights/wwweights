import '../../styles/global.css';
import 'material-symbols';
import { IconButton } from "./IconButton";

describe('IconButton', () => {
    describe('iconButton.cy.ts', () => {
        it('should display component', () => {
          cy.mount(<IconButton icon='menu' onClick={() => ""}/>)
          cy.get('button').should('have.class', 'cursor-pointer hover:bg-gray-100 focus:bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center')
        })
      })

    describe('Icon', () => {
        it('should display icon', () => {
            cy.mount(<IconButton icon='menu' onClick={() => ""}/>)
            cy.get('button i').should('be.visible')
        })
    })
})


export { };