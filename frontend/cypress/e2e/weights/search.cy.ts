import items from "../../fixtures/items/list.json"
import relatedtags from "../../fixtures/tags/related.json"

const apiBaseUrl = Cypress.env("API_BASE_URL")

describe('Search /weights', () => {
    describe('Search', () => {
        beforeEach(() => {
            cy.task('clearNock')
            cy.task('nock', {
                hostname: apiBaseUrl,
                method: 'get',
                path: `/api/query/v1/items/list`,
                statusCode: 200,
                body: items,
            })

            cy.getRelatedTags()

            cy.visitLocalPage("/weights")
            cy.wait('@getRelatedTags')
        })

        it('should search items when click search items', () => {
            cy.dataCy('search').type(items[0].tags[0].slug)
            cy.dataCy('text-input-submit-icon-query').click()

            cy.url().should('include', items[0].tags[0].slug)
        })

        it.only('should search items when hit enter', () => {
            cy.dataCy('search').type(`${items[0].tags[0].slug}{enter}`)
            cy.url().should('include', items[0].tags[0].slug)
        })

        it('should search items when query in url', () => {
            cy.visitLocalPage(`/weights?query=${items[0].tags[0].slug}`)
            cy.wait('@getRelatedTags')

            cy.dataCy('search').should('have.value', items[0].tags[0].slug)
        })
    })

    describe('Related Tags', () => {
        beforeEach(() => {
            cy.task('clearNock')
            cy.task('nock', {
                hostname: apiBaseUrl,
                method: 'get',
                path: `/api/query/v1/items/list`,
                statusCode: 200,
                body: items,
            })

            cy.getRelatedTags()

            cy.visitLocalPage("/weights")
            cy.wait('@getRelatedTags')
        })

        describe('Displayed tags', () => {
            beforeEach(() => {
                // Search item
                cy.dataCy('search').type(items[0].tags[0].slug)
                cy.dataCy('text-input-submit-icon-query').click()
            })

            it('should display tags when search', () => {
                cy.dataCy('search-header-tag-wrapper').should('be.visible')
            })

            it('should search tag when click on tag', () => {
                // Click first tag
                cy.dataCy('search-header-tag-wrapper', ' a').first().click()

                cy.dataCy('search').should('have.value', relatedtags[0].name)
            })

            it('should not display tag in list when search for tag', () => {
                // Click first tag
                cy.dataCy('search-header-tag-wrapper', ' a').first().click()

                cy.dataCy('search-header-tag-wrapper', ' a').first().should('not.exist')
            })
        })

        it('should not display tags when no search', () => {
            cy.dataCy('search-header-tag-wrapper').should('not.exist')
        })
    })
})

export { }

