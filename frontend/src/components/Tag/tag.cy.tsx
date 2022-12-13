import '../../styles/global.css';
import { Tag } from './Tag';

describe('Tag', () => {
    it('should display correct color', () => {
        const color = "amber"

        cy.mount(<Tag to="/" color={"amber"}>Test</Tag>)

        cy.get('a').should('have.class', `bg-${color}-500`)
        cy.get('a').should('have.class', `text-${color}-600`)
    })
})

export { };

