import { range } from "./range"

describe("Range", () => {
    it("should create range from number to number, including start and end", () => {
        expect(range(1, 5)).deep.equal([1, 2, 3, 4, 5])
        expect(range(0, 1)).deep.equal([0, 1])
        expect(range(-1, 1)).deep.equal([-1, 0, 1])
        expect(range(-1, 1)).not.deep.equal([1, 0, -1])
    })
    it("should create array with X if start and end are X", () => {
        expect(range(1, 1)).to.have.length(1)
        expect(range(1, 1)).deep.equal([1])
        expect(range(0, 0)).deep.equal([0])
        expect(range(-1, -1)).deep.equal([-1])
    })

    it("should create empty array when numbers are in wrong order", () => {
        expect(range(1, 0)).to.have.length(0)
        expect(range(5, 0)).to.have.length(0)
    })
})