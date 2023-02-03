import { generatePageString } from "./pageString"

describe("generatePageString", () => {
    it("generates a string with the current page number when the current page is greater than 1", () => {
        const currentPage = 2
        const result = generatePageString(currentPage)
        expect(result).to.equal(" | Page 2")
    })

    it("generates an empty string when the current page is 1", () => {
        const currentPage = 1
        const result = generatePageString(currentPage)
        expect(result).to.equal("")
    })
})

export { }

