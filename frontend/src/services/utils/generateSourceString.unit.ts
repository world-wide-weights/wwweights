import { generateSourceString } from "./generateSourceString"

describe("generateSourceString", () => {
    it("should return isUrl true and a string with stripped hostname of url", () => {
        const source = "https://www.google.com"
        const name = "test"
        const weightString = "1 kg"
        const { sourceString, isUrl } = generateSourceString({ source, name, weightString })
        expect(sourceString).to.equal(`According to google.com, ${name} weights ${weightString}.`)
        expect(isUrl).to.equal(true)
    })

    it("should return isUrl false and a string with the source", () => {
        const source = "test"
        const name = "test"
        const weightString = "1 kg"
        const { sourceString, isUrl } = generateSourceString({ source, name, weightString })
        expect(sourceString).to.equal(`According to ${source}, ${name} weights ${weightString}.`)
        expect(isUrl).to.equal(false)
    })
})