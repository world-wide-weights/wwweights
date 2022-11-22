import 'material-symbols';
import '../../styles/global.css';
import { Pagination } from './Pagination';

const ITEMS_PER_PAGE = 10
const TOTAL_ITEMS = 100

describe('Pagination', () => {
    it('should display component', () => {
        cy.mount(<Pagination totalItems={TOTAL_ITEMS} currentPage={1} basePath={'/'} itemsPerPage={ITEMS_PER_PAGE} />)
    })

    it('should not display component when not enough items', () => {
        cy.mount(<Pagination totalItems={10} currentPage={1} basePath={'/'} itemsPerPage={10} />)
    })

    it('should disable prevoius button when on page 1', () => {
        cy.mount(<Pagination totalItems={TOTAL_ITEMS} currentPage={1} basePath={'/'} itemsPerPage={ITEMS_PER_PAGE} />)
    })

    it('should disable next button when on last page', () => {
        cy.mount(<Pagination totalItems={TOTAL_ITEMS} currentPage={1} basePath={'/'} itemsPerPage={ITEMS_PER_PAGE} />)
    })

    it('should show active state of current page', () => {
        cy.mount(<Pagination totalItems={TOTAL_ITEMS} currentPage={4} basePath={'/'} itemsPerPage={ITEMS_PER_PAGE} />)
    })

    it('should show no left dots and show no right dots', () => {
        cy.mount(<Pagination totalItems={15} currentPage={4} basePath={'/'} itemsPerPage={5} />)
    })

    it('should show no left dots, but show right dots', () => {
        cy.mount(<Pagination totalItems={TOTAL_ITEMS} currentPage={4} basePath={'/'} itemsPerPage={ITEMS_PER_PAGE} />)
    })

    it('should show left dots, but show no right dots', () => {
        cy.mount(<Pagination totalItems={TOTAL_ITEMS} currentPage={4} basePath={'/'} itemsPerPage={ITEMS_PER_PAGE} />)
    })

    it('should show left dots and show right dots', () => {
        cy.mount(<Pagination totalItems={15} currentPage={4} basePath={'/'} itemsPerPage={5} />)
    })

    it('should show more siblings', () => {
        cy.mount(<Pagination totalItems={150} siblingCount={2} currentPage={4} basePath={'/'} itemsPerPage={5} />)
    })

    it('should hide text on mobile', () => {
        cy.viewport('iphone-x')
        cy.mount(<Pagination totalItems={150} currentPage={4} basePath={'/'} itemsPerPage={5} />)
    })
})

export { };

