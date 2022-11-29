import { PaginationType, routes } from "./routes"
describe("Routes", () => {
    describe("Pagination Routes", () => {
        describe("weights", () => {
            it("should return canonical link when on page 1 and query same as default", () => {
                const options: PaginationType = { page: 1, itemsPerPage: 10, defaultItemsPerPage: 10 }

                expect(routes.weights.list(options)).to.equal("/weights")
            })

            it("should add page query when on other page", () => {
                const options: PaginationType = { page: 5, itemsPerPage: 10, defaultItemsPerPage: 10 }

                expect(routes.weights.list(options)).to.equal("/weights?page=5")
            })

            it("should add limit query when custom limit is set", () => {
                const options: PaginationType = { page: 1, itemsPerPage: 15, defaultItemsPerPage: 10 }

                expect(routes.weights.list(options)).to.equal("/weights?limit=15")
            })

            it("should combine limit and page query when both a provided", () => {
                const options: PaginationType = { page: 5, itemsPerPage: 5, defaultItemsPerPage: 10 }

                expect(routes.weights.list(options)).to.equal("/weights?page=5&limit=5")
            })
        })
    })
})

export { }

