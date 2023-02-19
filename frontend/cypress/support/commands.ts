/// <reference types="cypress" />

import sessiondata from "../fixtures/auth/sessiondata.json"
import statisticsAuth from "../fixtures/auth/statistics.json"
import paginatedItems from "../fixtures/items/list.json"
import paginatedRelatedItems from "../fixtures/items/related.json"
import paginatedSingleItem from "../fixtures/items/single.json"
import itemStatistics from "../fixtures/items/statistics.json"
import paginatedContributions from "../fixtures/profile/contributions.json"
import profileStatistics from "../fixtures/profile/statistics.json"
import statistics from "../fixtures/statistics/statistics.json"
import paginatedTagsList from "../fixtures/tags/list.json"

const API_BASE_URL_AUTH = Cypress.env("PUBLIC_API_BASE_URL_AUTH")
const API_BASE_URL_QUERY_CLIENT = Cypress.env("PUBLIC_API_BASE_URL_QUERY_CLIENT")
const API_BASE_URL_QUERY_SERVER = Cypress.env("PUBLIC_API_BASE_URL_QUERY_SERVER")
const API_BASE_URL_COMMAND = Cypress.env("PUBLIC_API_BASE_URL_COMMAND")
const PUBLIC_API_BASE_URL_IMAGE = Cypress.env("PUBLIC_API_BASE_URL_IMAGE")
const LOCAL_STORAGE_KEY = "session"

/**** Command helper *****/

Cypress.Commands.add("dataCy", (dataCy, customSelector = "") => {
	cy.get(`[datacy=${dataCy}]${customSelector}`)
})

Cypress.Commands.add("visitLocalPage", (path = "", options) => {
	cy.visit(`${Cypress.env("CLIENT_BASE_URL")}${path}`, options)
})

Cypress.Commands.add("check404", () => {
	cy.contains("404 - Page not found").should("be.visible")
})

Cypress.Commands.add("check500", () => {
	cy.contains("500 - Error on Server Side").should("be.visible")
})

Cypress.Commands.add("checkNetworkError", () => {
	cy.contains("We could not connect to the server. Please check your internet connection and try again.").should("be.visible")
})

Cypress.Commands.add("checkCurrentActivePage", (activePageNumber) => {
	cy.dataCy(`pagination-button-page-${activePageNumber}`).should("have.class", "bg-blue-500")
	cy.dataCy(`pagination-button-page-${activePageNumber}`).should("have.class", "text-white")
})

/**** Mock Pages *****/

Cypress.Commands.add("mockDiscoverPage", (options) => {
	cy.mockTagsListClient()

	// Clear nock and activate it in items list
	cy.mockItemsList(options)
	cy.mockImageServe()

	// Mock Statistics
	cy.task("nock", {
		hostname: API_BASE_URL_QUERY_SERVER,
		method: "get",
		path: "/items/statistics",
		statusCode: 200,
		body: itemStatistics,
	})

	cy.mockRelatedTags()
})

Cypress.Commands.add("mockSingleWeightPage", () => {
	// Clear nock and activate it
	cy.task("resetNock")

	cy.mockTagsListClient()
	cy.mockImageServe()

	// Mock items single
	cy.task("nock", {
		hostname: API_BASE_URL_QUERY_SERVER,
		method: "get",
		path: "/items/list",
		statusCode: 200,
		body: paginatedSingleItem,
	})

	// Mock items related
	cy.task("nock", {
		hostname: API_BASE_URL_QUERY_SERVER,
		method: "get",
		path: "/items/related",
		statusCode: 200,
		body: paginatedRelatedItems,
	})

	cy.mockRelatedTags()
})

Cypress.Commands.add("mockHome", () => {
	// Clear nock and activate it in items list
	cy.mockItemsList()

	cy.mockImageServe()
	cy.mockTagsListClient()

	cy.task("nock", {
		hostname: API_BASE_URL_AUTH,
		method: "get",
		path: "/auth/statistics",
		statusCode: 200,
		body: statisticsAuth,
	})

	cy.task("nock", {
		hostname: API_BASE_URL_QUERY_SERVER,
		method: "get",
		path: "/statistics",
		statusCode: 200,
		body: statistics,
	})
})

Cypress.Commands.add("mockProfilePage", (options) => {
	cy.task("resetNock")

	const body =
		options?.contribtionsCount || options?.contribtionsCount === 0
			? {
					...paginatedContributions,
					data: paginatedContributions.data.slice(0, options?.contribtionsCount),
			  }
			: paginatedContributions

	cy.mockImageServe()
	cy.mockTagsListClient()

	// Mock Contributions
	cy.intercept("GET", `${API_BASE_URL_QUERY_CLIENT}/items/list*`, {
		body,
	}).as("mockContributions")

	// Mock statistics
	cy.intercept("GET", `${API_BASE_URL_QUERY_CLIENT}/profiles/*/statistics`, {
		body: options?.hasStatistics ?? true ? profileStatistics : {},
	}).as("mockProfileStatistics")

	// Mock profile
	cy.intercept("GET", `${API_BASE_URL_AUTH}/profile/me`, {
		fixture: "profile/me.json",
	}).as("mockProfile")
})

/**** Mock Fetch Server *****/

Cypress.Commands.add("mockTagsList", (options) => {
	cy.task("resetNock")

	const body =
		options?.itemCount || options?.itemCount === 0
			? {
					...paginatedTagsList,
					data: paginatedTagsList.data.slice(0, options.itemCount),
			  }
			: paginatedTagsList

	cy.task("nock", {
		hostname: API_BASE_URL_QUERY_SERVER,
		method: "get",
		path: "/tags/list",
		statusCode: 200,
		body,
	})
})

Cypress.Commands.add("mockItemsList", (options) => {
	cy.task("resetNock")

	const body =
		options?.itemCount || options?.itemCount === 0
			? {
					...paginatedItems,
					data: paginatedItems.data.slice(0, options.itemCount),
			  }
			: paginatedItems

	cy.task("nock", {
		hostname: API_BASE_URL_QUERY_SERVER,
		method: "get",
		path: "/items/list",
		statusCode: 200,
		body,
	})
})

Cypress.Commands.add("mockImageServe", () => {
	cy.intercept("GET", `${PUBLIC_API_BASE_URL_IMAGE}/serve/*`, {
		statusCode: 201,
	}).as("mockImageServe")

	cy.task("nock", {
		hostname: PUBLIC_API_BASE_URL_IMAGE,
		method: "get",
		path: "/*",
		statusCode: 200,
	})
})

/**** Mock Fetch Client *****/

Cypress.Commands.add("mockTagsListClient", () => {
	cy.intercept("GET", `${API_BASE_URL_QUERY_CLIENT}/tags/list*`, {
		fixture: "tags/related.json",
	}).as("mockTagsListClient")
})

Cypress.Commands.add("mockLogin", () => {
	cy.mockImageServe()
	cy.mockTagsListClient()

	cy.intercept("POST", `${API_BASE_URL_AUTH}/auth/login`, {
		fixture: "auth/tokens.json",
	}).as("mockLogin")

	cy.intercept("POST", `${API_BASE_URL_AUTH}/auth/refresh`, {
		fixture: "auth/tokens.json",
	}).as("mockRefresh")
})

Cypress.Commands.add("mockRegister", () => {
	cy.mockImageServe()
	cy.mockTagsListClient()

	cy.intercept("POST", `${API_BASE_URL_AUTH}/auth/register`, {
		fixture: "auth/tokens.json",
	}).as("mockRegister")

	cy.intercept("POST", `${API_BASE_URL_AUTH}/auth/refresh`, {
		fixture: "auth/tokens.json",
	}).as("mockRefresh")
})

Cypress.Commands.add("mockRelatedTags", () => {
	cy.intercept("GET", `${API_BASE_URL_QUERY_CLIENT}/tags/related*`, {
		fixture: "tags/related.json",
	}).as("mockRelatedTags")
})

Cypress.Commands.add("mockCreateItem", () => {
	cy.intercept("POST", `${API_BASE_URL_COMMAND}/items/insert`, {
		statusCode: 200,
	}).as("mockCreateItem")
})

Cypress.Commands.add("mockUploadImage", () => {
	cy.intercept("POST", `${PUBLIC_API_BASE_URL_IMAGE}/upload/image`, {
		statusCode: 201,
	}).as("mockUploadImage")
})

Cypress.Commands.add("login", ({ route, visitOptions }) => {
	cy.mockLogin()

	cy.visitLocalPage(route, {
		...visitOptions,
		onBeforeLoad: (window) => {
			window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sessiondata))
		},
	})
})

Cypress.Commands.add("mockSingleItem", () => {
	cy.intercept("GET", `${API_BASE_URL_QUERY_CLIENT}/items/list*`, {
		fixture: "items/single.json",
	}).as("mockSingleItem")
})

Cypress.Commands.add("mockEditItem", () => {
	cy.intercept("POST", `${API_BASE_URL_COMMAND}/items/*/suggest/edit`, {
		statusCode: 200,
	}).as("mockEditItem")
})

Cypress.Commands.add("mockDeleteItem", () => {
	cy.intercept("POST", `${API_BASE_URL_COMMAND}/items/*/suggest/delete`, {
		statusCode: 200,
	}).as("mockDeleteItem")
})

export {}
