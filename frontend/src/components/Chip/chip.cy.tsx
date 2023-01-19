import '../../styles/global.css'
import { Chip } from './Chip'

describe('Chip', () => {
    it('should display correct color', () => {
        const color = "amber"

        cy.mount(<Chip to="/" color={"amber"}>Test</Chip>)

        cy.get('a').should('have.class', `bg-${color}-500`)
        cy.get('a').should('have.class', `text-${color}-600`)
    })
})

export { }

