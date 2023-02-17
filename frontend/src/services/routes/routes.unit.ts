import { PaginationBaseOptions } from "../pagination/pagination"
import { routes } from "./routes"

describe("Routes", () => {
    describe("Weights", () => {
        describe("List router", () => {
            it("should return canonical link when on page 1 and query same as default", () => {
                const options: PaginationBaseOptions = { page: 1, itemsPerPage: 10, defaultItemsPerPage: 10 }

                expect(routes.weights.list(options)).to.equal("/weights")
            })

            it("should add page query when on other page", () => {
                const options: PaginationBaseOptions = { page: 5, itemsPerPage: 10, defaultItemsPerPage: 10 }

                expect(routes.weights.list(options)).to.equal("/weights?page=5")
            })

            it("should add limit query when custom limit is set", () => {
                const options: PaginationBaseOptions = { page: 1, itemsPerPage: 15, defaultItemsPerPage: 10 }

                expect(routes.weights.list(options)).to.equal("/weights?limit=15")
            })

            it("should combine limit and page query when both a provided", () => {
                const options: PaginationBaseOptions = { page: 5, itemsPerPage: 5, defaultItemsPerPage: 10 }

                expect(routes.weights.list(options)).to.equal("/weights?page=5&limit=5")
            })
        })
        describe("Single router", () => {
            it("should create base url with slug when no options are provided", () => {
                expect(routes.weights.single("love")).to.equal("/weights/love")
                expect(routes.weights.single("friendship")).to.equal("/weights/friendship")
            })

            it("should create base url with slug and tab query when tab is provided", () => {
                expect(routes.weights.single("love", { tab: "matters" })).to.equal("/weights/love?tab=matters")
                expect(routes.weights.single("love", { tab: "comments" })).to.equal("/weights/love?tab=comments")
                expect(routes.weights.single("love", { tab: "revisions" })).to.equal("/weights/love?tab=revisions")
            })
        })
    })

    // TODO: Add missing route tests

    describe("contribute Routes", () => {
        it("should return contribute page", () => {
            expect(routes.contribute.create).to.equal("/contribute/create")
        })

        it("should return edit contribute page with slug", () => {
            expect(routes.contribute.edit("slug")).to.equal("/contribute/create/slug")
            expect(routes.contribute.edit("apple-iphone-12")).to.equal("/contribute/create/apple-iphone-12")
        })
    })

    describe("misc Routes", () => {
        it("should return about page", () => {
            expect(routes.misc.index).to.equal("/misc")
        })

        it("should return contact page", () => {
            expect(routes.misc.contact).to.equal("/misc/contact")
        })

        it("should return terms page", () => {
            expect(routes.misc.terms).to.equal("/misc/terms-and-conditions")
        })

        it("should return privacy page", () => {
            expect(routes.misc.privacy).to.equal("/misc/privacy-policy")
        })
    })

})

export { }

