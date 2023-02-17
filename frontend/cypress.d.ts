// Code stolen from cypress docs
// https://docs.cypress.io/api/commands/mount#Creating-a-New-cy-mount-Command
import { mount } from "cypress/react"

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Mount for component tests, mounts a component.
       */
      mount: typeof mount
      /**
       * Helper for easier selecting tags with datacy.
       * @param dataCy the dataCy attribute name of the tag we want to select 
       * @param customSelector add custom child selector, is used like css selectors 
       */
      dataCy(dataCy: string, customSelector?: string): Chainable<void>
      /**
       * Helper for easy navigate to local page.
       * @param path the path we want to go
       * @param options the options we have when visiting page for example failOnStatusCode: false
       */
      visitLocalPage(path?: string, options?: Partial<Cypress.VisitOptions>): Chainable<void>
      /**
       * Checks if we are on a 404 page.
       */
      check404(): Chainable<void>
      /**
       * Checks if we are on a 500 page.
       */
      check500(): Chainable<void>
      /**
       * In Pagination checks if the activePageNumber is active.
       * @param activePageNumber the page we want to check active status
       */
      checkCurrentActivePage(activePageNumber: number): Chainable<void>
      /**
       * Interceptor for related tag request.
       */
      mockGetRelatedTags(): Chainable<void>
      /**
       * Interceptor for tags list request.
       */
      mockGetTagsList(): Chainable<void>
      /**
       * Mocks all requests server side and client side
       * - clear and activate nock
       * - mock get items 
       * - mock related tags 
       * - mock item statistics
       * @param itemCount count of items getting back with body
       */
      mockDiscoverPage(itemCount?: number): Chainable<void>
      /**
       * Mock create item request.
       */
      mockCreateItem(): Chainable<void>
      /**
       * Mocks upload image request.
       */
      mockUploadImage(): Chainable<void>
      /**
       * Mock requests for single weight page.
       */
      mockSingleWeight(): Chainable<void>
      /**
       * Mock items list
       * @param itemCount count of items getting back with body
       */
      mockItemsList(itemCount?: number): Chainable<void>
      /**
       * Mocks login request.
       */
      mockLogin(): Chainable<void>
      /**
       * Mocks register request.
       */
      mockRegister(): Chainable<void>
      /**
       * Login to the app (Sets sessiondata to localstorage).
       * @param route the route we want to go after login
       * @param visitOptions the options we have when visiting page for example failOnStatusCode: false
       */
      login(route: string, visitOptions?: Partial<Cypress.VisitOptions>): Chainable<void>
      /**
       * Mock profile page with contributions, statistics and profile data.
       * @param contribtionsCount count of contributions getting back with body.
       * @param hasStatistics if we want to mock statistics having data or not.
       */
      mockProfilePage(options?: { contribtionsCount?: number, hasStatistics?: boolean }): Chainable<void>
      /**
       * Mocks delete item request.
       */
      mockDeleteItem(): Chainable<void>
    }
  }
}
