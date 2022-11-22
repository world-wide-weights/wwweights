import 'material-symbols';
import '../../styles/global.css';
import { Pagination } from './Pagination';

const ITEMS_PER_PAGE = 10
const TOTAL_ITEMS = 100

describe('Pagination', () => {
    describe('Desktop', () => {
        describe('Mount with first page', () => {
            beforeEach(() => {
                cy.mount(<Pagination totalItems={TOTAL_ITEMS} currentPage={1} basePath={'/'} itemsPerPage={ITEMS_PER_PAGE} />)
            })

            it('should display component', () => {
                cy.dataCy('pagination').should('be.visible')
            })

            it('should disable prevoius button when on page 1 desktop', () => {
                cy.dataCy('pagination-button-left-desktop').invoke('attr', 'href').should('eq', '')
                cy.dataCy('pagination-button-left-desktop').should('have.class', 'text-opacity-75 opacity-80')
            })

            it('should show active state of current page', () => {
                cy.dataCy("pagination-button-page-1").should('have.class', 'bg-blue-500 text-white')
            })

            it('should show no left dots, but show right dots', () => {
                // No left dots (if there where dots that would not exist)
                cy.dataCy('pagination-button-page-2').should('be.visible') // This is the place of the left dots

                // Right dots
                cy.dataCy('pagination-dots').should('be.visible')
                cy.dataCy('pagination-button-page-6').should('not.exist') // This is the place of right dots
            })
        })

        it('should not display component when not enough items', () => {
            cy.mount(<Pagination totalItems={10} currentPage={1} basePath={'/'} itemsPerPage={10} />)

            cy.dataCy('pagination').should('not.exist')
        })

        it('should disable next button when on last page desktop', () => {
            cy.mount(<Pagination totalItems={TOTAL_ITEMS} currentPage={10} basePath={'/'} itemsPerPage={ITEMS_PER_PAGE} />)

            cy.dataCy('pagination-button-right-desktop').invoke('attr', 'href').should('eq', '')
            cy.dataCy('pagination-button-right-desktop').should('have.class', 'text-opacity-75 opacity-80')
        })

        it('should show no left dots and show no right dots', () => {
            cy.mount(<Pagination totalItems={15} currentPage={1} basePath={'/'} itemsPerPage={5} />)
            cy.dataCy('pagination-dots').should('not.exist')
        })

        it('should show left dots, but show no right dots', () => {
            cy.mount(<Pagination totalItems={TOTAL_ITEMS} currentPage={8} basePath={'/'} itemsPerPage={ITEMS_PER_PAGE} />)

            // Left dots
            cy.dataCy('pagination-dots').should('be.visible')
            cy.dataCy('pagination-button-page-2').should('not.exist') // This is the place of the left dots

            // No Right dots (if there where dots that would not exist)
            cy.dataCy('pagination-button-page-6').should('be.visible') // This is the place of right dots
        })

        it('should show left dots and show right dots', () => {
            cy.mount(<Pagination totalItems={TOTAL_ITEMS} currentPage={4} basePath={'/'} itemsPerPage={ITEMS_PER_PAGE} />)

            cy.dataCy('pagination-dots').should('be.visible')

            cy.dataCy('pagination-button-page-2').should('not.exist') // This is the place of the left dots
            cy.dataCy('pagination-button-page-6').should('not.exist') // This is the place of right dots
        })
    })

    describe('Mobile', () => {
        beforeEach(() => {
            cy.viewport('iphone-x')
        })

        describe('Mount with first page', () => {
            beforeEach(() => {
                cy.mount(<Pagination totalItems={TOTAL_ITEMS} currentPage={1} basePath={'/'} itemsPerPage={ITEMS_PER_PAGE} />)
            })

            it('should hide text on mobile', () => {
                cy.dataCy('pagination-button-right-desktop').should('not.be.visible')
                cy.dataCy('pagination-button-left-desktop').should('not.be.visible')

                cy.dataCy('pagination-button-right-mobile').should('be.visible')
                cy.dataCy('pagination-button-left-mobile').should('be.visible')
            })

            it('should disable prevoius button when on page 1 mobile', () => {
                cy.dataCy('pagination-button-left-mobile').invoke('attr', 'href').should('eq', '')
                cy.dataCy('pagination-button-left-mobile', ' i').should('have.class', 'text-opacity-50')
            })
        })

        it('should disable next button when on last page mobile', () => {
            cy.mount(<Pagination totalItems={TOTAL_ITEMS} currentPage={10} basePath={'/'} itemsPerPage={ITEMS_PER_PAGE} />)

            cy.dataCy('pagination-button-right-mobile').invoke('attr', 'href').should('eq', '')
            cy.dataCy('pagination-button-right-mobile', ' i').should('have.class', 'text-opacity-50')
        })
    })
})

export { };

