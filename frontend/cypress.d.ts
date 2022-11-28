// Code stolen from cypress docs
// https://docs.cypress.io/api/commands/mount#Creating-a-New-cy-mount-Command


// TODO: Move in cypress/

import { mount } from "cypress/react";

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
      dataCy(dataCy: string, customSelector?: string): Chainable<void>
      visitLocalPage(path?: string, options?: Partial<Cypress.VisitOptions>): Chainable<void>
      check404(): Chainable<void>
      checkCurrentActivePage(activePageNumber: number): Chainable<void>
    }
  }
}
