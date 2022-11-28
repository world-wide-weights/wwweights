import { DOTS, paginationService } from "./pagination";

describe('Pagination', () => {

    // BUG: Fix bug with left dots (sollte punkte erst ab 3er seite anzeigen, nicht wenn für die 2 Seite noch platz ist)
    describe("should only display dots when there are at least two pages hidden", () => {
        it("should not display dots on page 4", () => {
            const options = {
                currentPage: 4,
                totalItems: 100,
                siblingCount: 1,
                itemsPerPage: 16
            }

            expect(paginationService(options)).deep.equal([1, 2, 3, 4, 5, 6, 7])
            expect(paginationService(options)).not.deep.equal([1, DOTS, 3, 4, 5, 6, 7])
        })
    })
})

export { };

