import { DOTS, paginationDataService, PaginationDataServiceParams } from "./pagination";

describe('Pagination', () => {

    describe("pagination data service", () => {
        // BUG: Fix bug with left dots (sollte punkte erst ab 3er seite anzeigen, nicht wenn für die 2 Seite noch platz ist)
        describe("should only display dots when there are at least two pages hidden", () => {
            describe("sibling count = 1", () => {
                const siblingCount = 1
                it("should not display left dots on page 4 with 7 pages", () => {
                    const options: PaginationDataServiceParams = {
                        totalPageCount: 7,
                        siblingCount,
                        currentPage: 4
                    }

                    expect(paginationDataService(options)).deep.equal([1, 2, 3, 4, 5, 6, 7])
                    expect(paginationDataService(options)).not.deep.equal([1, DOTS, 3, 4, 5, 6, 7])
                })

                it("should not display left dots on page 4 with 10 pages", () => {
                    const options: PaginationDataServiceParams = {
                        currentPage: 4,
                        totalPageCount: 10,
                        siblingCount
                    }

                    expect(paginationDataService(options)).deep.equal([1, 2, 3, 4, 5, DOTS, 10])
                })

                it("should not display right dots page 7 with 10 pages", () => {
                    const options: PaginationDataServiceParams = {
                        currentPage: 7,
                        totalPageCount: 10,
                        siblingCount
                    }

                    expect(paginationDataService(options)).deep.equal([1, DOTS, 6, 7, 8, 9, 10])
                })

                it("should display right & left dots page 6 with 10 pages", () => {
                    const options: PaginationDataServiceParams = {
                        currentPage: 6,
                        totalPageCount: 10,
                        siblingCount
                    }

                    expect(paginationDataService(options)).deep.equal([1, DOTS, 5, 6, 7, DOTS, 10])
                })
            })

            describe("sibling count = 2", () => {
                const siblingCount = 2
                it("should display right dots on page 5 with 10 pages and 2 siblings", () => {
                    const options: PaginationDataServiceParams = {
                        currentPage: 5,
                        totalPageCount: 10,
                        siblingCount
                    }

                    expect(paginationDataService(options)).deep.equal([1, 2, 3, 4, 5, 6, 7, DOTS, 10])
                })

                it("should display lefts dots on page 6 with 10 pages and 2 siblings", () => {
                    const options: PaginationDataServiceParams = {
                        currentPage: 6,
                        totalPageCount: 10,
                        siblingCount
                    }

                    expect(paginationDataService(options)).deep.equal([1, DOTS, 4, 5, 6, 7, 8, 9, 10])
                })
            })
        })

        it('should show no left dots, but show right dots on page 1 with 10 pages and 1 sibling', () => {
            const options: PaginationDataServiceParams = {
                currentPage: 1,
                totalPageCount: 10,
                siblingCount: 1
            }

            expect(paginationDataService(options)).deep.equal([1, 2, 3, 4, 5, DOTS, 10])
        })

        it('should only show numbers when items are less than max pagination item length', () => {
            const options: PaginationDataServiceParams = {
                currentPage: 1,
                totalPageCount: 3,
                siblingCount: 1
            }

            expect(paginationDataService(options)).deep.equal([1, 2, 3])
        })
    })
})

export { };

