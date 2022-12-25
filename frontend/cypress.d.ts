// Code stolen from cypress docs
// https://docs.cypress.io/api/commands/mount#Creating-a-New-cy-mount-Command
import { mount } from "cypress/react";

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Mount for component tests, mounts a component.
       */
      mount: typeof mount;
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
       * In Pagination checks if the activePageNumber is active.
       * @param activePageNumber the page we want to check active status
       */
      checkCurrentActivePage(activePageNumber: number): Chainable<void>
      /**
       * Interceptor for related tag request.
       */
      getRelatedTags(): Chainable<void>
    }
  }
}
