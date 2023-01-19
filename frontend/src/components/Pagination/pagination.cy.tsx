import "material-symbols"
import { RoutePagination } from "../../services/routes/routes"
import "../../styles/global.css"
import { Pagination } from "./Pagination"

const ITEMS_PER_PAGE = 10
const TOTAL_ITEMS = 100
const testRoute: RoutePagination = () => "/"

describe("Pagination", () => {
    describe("Desktop", () => {
        describe("Mount with first page", () => {
            beforeEach(() => {
                cy.mount(<Pagination totalItems={TOTAL_ITEMS} currentPage={1} baseRoute={testRoute} itemsPerPage={ITEMS_PER_PAGE} />)
            })

            it("should display component", () => {
                cy.dataCy("pagination").should("be.visible")
            })

            it("should disable prevoius button when on page 1 desktop", () => {
                cy.dataCy("pagination-button-previous").invoke("attr", "href").should("eq", "")
                cy.dataCy("pagination-button-previous").should("have.class", "text-opacity-75")
                cy.dataCy("pagination-button-previous").should("have.class", "opacity-80")
            })

            it("should show active state of current page", () => {
                cy.dataCy("pagination-button-page-1").should("have.class", "bg-blue-500")
                cy.dataCy("pagination-button-page-1").should("have.class", "text-white")
            })
        })

        it("should not display component when not enough items", () => {
            cy.mount(<Pagination totalItems={10} currentPage={1} baseRoute={testRoute} itemsPerPage={10} />)

            cy.dataCy("pagination").should("not.exist")
        })

        it("should disable next button when on last page desktop", () => {
            cy.mount(<Pagination totalItems={TOTAL_ITEMS} currentPage={10} baseRoute={testRoute} itemsPerPage={ITEMS_PER_PAGE} />)

            cy.dataCy("pagination-button-next").invoke("attr", "href").should("eq", "")
            cy.dataCy("pagination-button-next").should("have.class", "text-opacity-75")
            cy.dataCy("pagination-button-next").should("have.class", "opacity-80")
        })
    })

    describe("Tablet", () => {
        beforeEach(() => {
            // Tablet (bzw. between sm and md in tailwind)
            cy.viewport(660, 1000)
        })

        describe("Mount with first page", () => {
            beforeEach(() => {
                cy.mount(<Pagination totalItems={TOTAL_ITEMS} currentPage={1} baseRoute={testRoute} itemsPerPage={ITEMS_PER_PAGE} />)
            })

            it("should hide text on tablet", () => {
                cy.dataCy("pagination-button-next").should("not.be.visible")
                cy.dataCy("pagination-button-previous").should("not.be.visible")

                cy.dataCy("pagination-button-next-tablet").should("be.visible")
                cy.dataCy("pagination-button-previous-tablet").should("be.visible")
            })

            it("should disable previous button when on page 1 tablet", () => {
                cy.dataCy("pagination-button-previous-tablet").invoke("attr", "href").should("eq", "")
                cy.dataCy("pagination-button-previous-tablet", " i").should("have.class", "text-opacity-50")
            })
        })

        it("should disable next button when on last page tablet", () => {
            cy.mount(<Pagination totalItems={TOTAL_ITEMS} currentPage={10} baseRoute={testRoute} itemsPerPage={ITEMS_PER_PAGE} />)

            cy.dataCy("pagination-button-next-tablet").invoke("attr", "href").should("eq", "")
            cy.dataCy("pagination-button-next-tablet", " i").should("have.class", "text-opacity-50")
        })
    })

    describe("Mobile", () => {
        beforeEach(() => {
            cy.viewport("iphone-x")
        })

        describe("Mount with first page", () => {
            beforeEach(() => {
                cy.mount(<Pagination totalItems={3} currentPage={1} baseRoute={testRoute} itemsPerPage={1} />)
            })

            it("should hide text on mobile", () => {
                cy.dataCy("pagination-button-page-1").should("not.be.visible")
                cy.dataCy("pagination-button-page-2").should("not.be.visible")
                cy.dataCy("pagination-button-page-3").should("not.be.visible")
            })

            it("should not show previous button when on page 1 mobile", () => {
                cy.dataCy("pagination-button-previous").should("not.be.visible")
            })
        })

        it("should not show next button when on page 1 mobile", () => {
            cy.mount(<Pagination totalItems={3} currentPage={3} baseRoute={testRoute} itemsPerPage={1} />)

            cy.dataCy("pagination-button-next").should("not.be.visible")
        })
    })
})

export { }

