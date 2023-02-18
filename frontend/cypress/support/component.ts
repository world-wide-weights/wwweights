// ***********************************************************
// This example support/component.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

import "@bahmutov/cypress-code-coverage/support"
import { mount } from "cypress/react18"
import { NextRouter } from "next/router"
import "./commands"

/**
 * Adds mount command.
 */
Cypress.Commands.add("mount", mount)

/**
 * Mock Next Router.
 * @example 
 * ```jsx
 * const router = createRouter()
 * <RouterContext.Provider value={router}>
 *     <CustomComponentNeedsRouter />
 * </RouterContext.Provider>
 * ```
 * @param params custom params for example custom route.
 * @returns next router mock instance.
 */
export const createRouter = (params?: Partial<NextRouter>): NextRouter => ({
    route: "/",
    pathname: "/",
    query: {},
    asPath: "",
    basePath: "/",
    back: cy.spy().as("back"),
    beforePopState: cy.spy().as("beforePopState"),
    forward: cy.spy().as("forward"),
    prefetch: cy.stub().as("prefetch").resolves(),
    push: cy.spy().as("push"),
    reload: cy.spy().as("reload"),
    replace: cy.spy().as("replace"),
    events: {
        emit: cy.spy().as("emit"),
        off: cy.spy().as("off"),
        on: cy.spy().as("on"),
    },
    isFallback: false,
    isLocaleDomain: true,
    isReady: true,
    defaultLocale: "en",
    domainLocales: [],
    isPreview: false,
    ...params,
})