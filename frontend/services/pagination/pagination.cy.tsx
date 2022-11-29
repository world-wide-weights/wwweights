import { DOTS, paginationService } from "./pagination";

describe('Pagination', () => {

    // BUG: Fix bug with left dots (sollte punkte erst ab 3er seite anzeigen, nicht wenn für die 2 Seite noch platz ist)
    describe("should only display dots when there are at least two pages hidden", () => {
        describe("sibling count = 1", () => {
            const siblingCount = 1
            it("should not display left dots on page 4 with 7 pages", () => {
                const options = {
                    currentPage: 4,
                    totalItems: 100,
                    siblingCount,
                    itemsPerPage: 16
                }

                expect(paginationService(options)).deep.equal([1, 2, 3, 4, 5, 6, 7])
                expect(paginationService(options)).not.deep.equal([1, DOTS, 3, 4, 5, 6, 7])
            })

            it("should not display left dots on page 4 with 10 pages", () => {
                const options = {
                    currentPage: 4,
                    totalItems: 100,
                    siblingCount,
                    itemsPerPage: 10
                }

                expect(paginationService(options)).deep.equal([1, 2, 3, 4, 5, DOTS, 10])
            })

            it("should not display right dots page 7 with 10 pages", () => {
                const options = {
                    currentPage: 7,
                    totalItems: 100,
                    siblingCount,
                    itemsPerPage: 10
                }

                expect(paginationService(options)).deep.equal([1, DOTS, 6, 7, 8, 9, 10])
            })

            it("should display right & left dots page 6 with 10 pages", () => {
                const options = {
                    currentPage: 6,
                    totalItems: 100,
                    siblingCount,
                    itemsPerPage: 10
                }

                expect(paginationService(options)).deep.equal([1, DOTS, 5, 6, 7, DOTS, 10])
            })
        })

        describe("sibling count = 2", () => {
            const siblingCount = 2
            it("should display right dots on page 5 with 10 pages and 2 siblings", () => {
                const options = {
                    currentPage: 5,
                    totalItems: 100,
                    siblingCount,
                    itemsPerPage: 10
                }

                expect(paginationService(options)).deep.equal([1, 2, 3, 4, 5, 6, 7, DOTS, 10])
            })

            it("should display lefts dots on page 6 with 10 pages and 2 siblings", () => {
                const options = {
                    currentPage: 6,
                    totalItems: 100,
                    siblingCount,
                    itemsPerPage: 10
                }

                expect(paginationService(options)).deep.equal([1, DOTS, 4, 5, 6, 7, 8, 9, 10])
            })
        })
    })
})

export { };

