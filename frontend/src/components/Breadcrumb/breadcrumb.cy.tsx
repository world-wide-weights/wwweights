import 'material-symbols';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import { createRouter } from '../../../cypress/support/component';
import '../../styles/global.css';
import { Breadcrumb } from './Breadcrumb';

describe('Breadcrumb', () => {
    it('should display breadcrumb', () => {
        const router = createRouter({ asPath: "/link" })
        cy.mount(<RouterContext.Provider value={router}>
            <Breadcrumb />
        </RouterContext.Provider>)
    })

    describe('Home', () => {
        beforeEach(() => {
            const router = createRouter({ asPath: "/link" })
            cy.mount(<RouterContext.Provider value={router}>
                <Breadcrumb />
            </RouterContext.Provider>)
        })

        it('should display home icon at start', () => {
            cy.dataCy('breadcrumb-home').should('be.visible')
        })

        it('should redirect to home when click home icon', () => {
            cy.dataCy('breadcrumb-home').should('be.visible')
        })
    })

    describe('Middle Links', () => {
        beforeEach(() => {
            const router = createRouter({ asPath: "/link/link2/end" })
            cy.mount(<RouterContext.Provider value={router}>
                <Breadcrumb />
            </RouterContext.Provider>)
        })

        it('should have link to /link at second position', () => {
            cy.dataCy('crumb-Link').should('be.visible')
            cy.dataCy('crumb-Link').should('have.attr', 'href', '/link')
        })

        it('should have link to /link/link2 at third position', () => {
            cy.dataCy('crumb-Link2').should('be.visible')
            cy.dataCy('crumb-Link2').should('have.attr', 'href', '/link/link2')
        })
    })

    describe('Ending', () => {
        beforeEach(() => {
            const router = createRouter({ asPath: "/link/end" })
            cy.mount(<RouterContext.Provider value={router}>
                <Breadcrumb />
            </RouterContext.Provider>)
        })

        it('should have no link when last element', () => {
            cy.dataCy('crumb-End').should('be.visible')
            cy.dataCy('crumb-End').should('not.have.attr', 'href')
        })
    })

    describe('Custom Ending', () => {
        beforeEach(() => {
            const router = createRouter({ asPath: "/link/end" })
            cy.mount(<RouterContext.Provider value={router}>
                <Breadcrumb customEndingText="customEnd" />
            </RouterContext.Provider>)
        })

        it('should not display end link when customEndingText is set', () => {
            cy.dataCy('crumb-End').should('not.exist')
        })

        it('should display customEndingText when customEndingText is set', () => {
            cy.dataCy('crumb-customEnd').should('be.visible')
        })

        it('should not be link when customEndingText is set', () => {
            cy.dataCy('crumb-customEnd').should('be.visible')
            cy.dataCy('crumb-customEnd').should('not.have.attr', 'href')
        })
    })
})

export { };

