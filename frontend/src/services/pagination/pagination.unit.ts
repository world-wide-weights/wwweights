import { PaginationDataServiceParams, PaginationServiceParams } from "../../types/pagination"
import { Ellipsis, getTotalPageCount, paginationDataService, paginationService } from "./pagination"

describe("Pagination", () => {
	describe("pagination data service", () => {
		describe("should only display dots when there are at least two pages hidden", () => {
			describe("sibling count = 1", () => {
				const siblingCount = 1
				it("should not display left dots on page 4 with 7 pages", () => {
					const options: PaginationDataServiceParams = {
						totalPageCount: 7,
						siblingCount,
						currentPage: 4,
					}

					expect(paginationDataService(options)).deep.equal([1, 2, 3, 4, 5, 6, 7])
					expect(paginationDataService(options)).not.deep.equal([1, Ellipsis, 3, 4, 5, 6, 7])
				})

				it("should not display left dots on page 4 with 10 pages", () => {
					const options: PaginationDataServiceParams = {
						currentPage: 4,
						totalPageCount: 10,
						siblingCount,
					}

					expect(paginationDataService(options)).deep.equal([1, 2, 3, 4, 5, Ellipsis, 10])
				})

				it("should not display right dots page 7 with 10 pages", () => {
					const options: PaginationDataServiceParams = {
						currentPage: 7,
						totalPageCount: 10,
						siblingCount,
					}

					expect(paginationDataService(options)).deep.equal([1, Ellipsis, 6, 7, 8, 9, 10])
				})

				it("should display right & left dots page 6 with 10 pages", () => {
					const options: PaginationDataServiceParams = {
						currentPage: 6,
						totalPageCount: 10,
						siblingCount,
					}

					expect(paginationDataService(options)).deep.equal([1, Ellipsis, 5, 6, 7, Ellipsis, 10])
				})
			})

			describe("sibling count = 2", () => {
				const siblingCount = 2
				it("should display right dots on page 5 with 10 pages and 2 siblings", () => {
					const options: PaginationDataServiceParams = {
						currentPage: 5,
						totalPageCount: 10,
						siblingCount,
					}

					expect(paginationDataService(options)).deep.equal([1, 2, 3, 4, 5, 6, 7, Ellipsis, 10])
				})

				it("should display lefts dots on page 6 with 10 pages and 2 siblings", () => {
					const options: PaginationDataServiceParams = {
						currentPage: 6,
						totalPageCount: 10,
						siblingCount,
					}

					expect(paginationDataService(options)).deep.equal([1, Ellipsis, 4, 5, 6, 7, 8, 9, 10])
				})
			})
		})

		it("should show no left dots, but show right dots on page 1 with 10 pages and 1 sibling", () => {
			const options: PaginationDataServiceParams = {
				currentPage: 1,
				totalPageCount: 10,
				siblingCount: 1,
			}

			expect(paginationDataService(options)).deep.equal([1, 2, 3, 4, 5, Ellipsis, 10])
		})

		it("should only show numbers when items are less than max pagination item length", () => {
			const options: PaginationDataServiceParams = {
				currentPage: 1,
				totalPageCount: 3,
				siblingCount: 1,
			}

			expect(paginationDataService(options)).deep.equal([1, 2, 3])
		})
	})

	describe("Total Page Count", () => {
		it("should return 0 when either one or both params are 0", () => {
			expect(getTotalPageCount(0, 0)).deep.equal(0)
			expect(getTotalPageCount(0, 1)).deep.equal(0)
			expect(getTotalPageCount(1, 0)).deep.equal(0)
		})

		it("should return 0 when either one or both params are negative", () => {
			expect(getTotalPageCount(-1, -1)).deep.equal(0)
			expect(getTotalPageCount(1, -1)).deep.equal(0)
			expect(getTotalPageCount(-1, 1)).deep.equal(0)
		})
	})

	describe("Pagination service", () => {
		it("should return pagination without links", () => {
			const options: PaginationServiceParams = {
				totalItems: 100,
				itemsPerPage: 10,
				siblingCount: 1,
				currentPage: 5,
				defaultItemsPerPage: 10,
				query: "",
				sort: "relevance",
				baseRoute: () => "/",
			}

			expect(paginationService(options)).deep.equal({
				prev: "/",
				next: "/",
				pages: [
					{
						content: 1,
						link: "/",
					},
					{
						content: "...",
					},
					{
						content: 4,
						link: "/",
					},
					{
						content: 5,
						link: "/",
					},
					{
						content: 6,
						link: "/",
					},
					{
						content: "...",
					},
					{
						content: 10,
						link: "/",
					},
				],
			})
		})

		it("should return empty pages and links null when totalItems is 0", () => {
			const options: PaginationServiceParams = {
				totalItems: 0,
				itemsPerPage: 10,
				siblingCount: 1,
				currentPage: 2,
				defaultItemsPerPage: 10,
				query: "",
				sort: "relevance",
				baseRoute: () => "/",
			}

			expect(paginationService(options)).deep.equal({
				prev: null,
				next: null,
				pages: [],
			})
		})
	})
})

export {}
