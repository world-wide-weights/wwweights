import 'material-symbols';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import { createRouter } from '../../../cypress/support/component';
import { Crumb } from '../../services/breadcrumb/breadcrumb';
import '../../styles/global.css';
import { Breadcrumb } from './Breadcrumb';
import { RouterBreadcrumb } from './RouterBreadcrumb';

describe("Breadcrumb", () => {
    describe("Base Breadcrumb", () => {
        beforeEach(() => {
            const breadcrumbs: Crumb[] = [{
                text: "love",
                to: "/love"
            }, {
                text: "matters"
            }]

            cy.mount(<Breadcrumb breadcrumbs={breadcrumbs} />)
        })

        it("should display Breadcrumb", () => {
            cy.dataCy("breadcrumb").should("be.visible")
        })

        it("should display text", () => {
            cy.dataCy("crumb-love").should("be.visible")
        })

        it("should display link", () => {
            cy.dataCy("crumb-love").should("have.attr", "href", "/love")
        })

        it("should display last crumb as text", () => {
            cy.dataCy("crumb-matters").should("be.visible")
            cy.dataCy("crumb-matters").should("not.have.attr", "href")
        })

        it("should display home icon at start", () => {
            cy.dataCy("breadcrumb-home").should("be.visible")
        })

        it("should display icon between crumbs", () => {
            // Check if two icons are visible
            cy.dataCy("breadcrumb-icon").should("have.length", 2)
        })
    })
})

describe('RouterBreadcrumb', () => {
    it('should display RouterBreadcrumb', () => {
        const router = createRouter({ asPath: "/link" })
        cy.mount(<RouterContext.Provider value={router}>
            <RouterBreadcrumb />
        </RouterContext.Provider>)
    })

    describe('Middle Links', () => {
        beforeEach(() => {
            const router = createRouter({ asPath: "/link/link2/end" })
            cy.mount(<RouterContext.Provider value={router}>
                <RouterBreadcrumb />
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
                <RouterBreadcrumb />
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
                <RouterBreadcrumb customLastCrumb="customEnd" />
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

