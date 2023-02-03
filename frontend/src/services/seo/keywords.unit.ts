import { generateKeywordString } from "./keywords"

describe("generateKeywordString", () => {

    it("generates a string of keywords separated by commas", () => {
        const keywords = ["dog", "cat", "bird"]
        const result = generateKeywordString(keywords)
        expect(result).to.equal("dog, cat, bird")
    })

    it("generates a single keyword when keywords array has length of 1", () => {
        const keywords = ["dog"]
        const result = generateKeywordString(keywords)
        expect(result).to.equal("dog")
    })

    it("generates an empty string when keywords array is empty", () => {
        const keywords: string[] = []
        const result = generateKeywordString(keywords)
        expect(result).to.equal("")
    })
})