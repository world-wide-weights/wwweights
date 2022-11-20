// Code stolen from cypress docs
// https://docs.cypress.io/api/commands/mount#Creating-a-New-cy-mount-Command

import { mount } from "cypress/react";

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
    }
  }
}
