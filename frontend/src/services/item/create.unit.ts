import { CreateEditItemForm } from "../../types/item"
import { prepareCreateItem } from "./create"

describe("Prepare create data", () => {
    describe("Required fields", () => {
        const data: CreateEditItemForm = {
            name: "test",
            weight: 200,
            unit: "g",
            isCa: [],
            valueType: "exact",
            source: "",
            tags: [],
        }

        it("should return correct data when fill required", () => {
            const createItem = prepareCreateItem(data)
            expect(createItem).deep.equal({
                name: "test",
                weight: {
                    value: 200,
                }
            })
        })
    })

    describe("Optional fields", () => {
        it("should omit additionalValue when valueType is exact", () => {
            const data: CreateEditItemForm = {
                name: "test",
                weight: 200,
                unit: "g",
                additionalValue: 300,
                isCa: [],
                valueType: "exact",
                source: "",
                tags: []
            }

            const createItem = prepareCreateItem(data)
            expect(createItem).deep.equal({
                name: "test",
                weight: {
                    value: 200,
                },
            })
        })

        it("should add additionalValue when valueType is range", () => {
            const data: CreateEditItemForm = {
                name: "test",
                weight: 200,
                unit: "g",
                additionalValue: 300,
                isCa: [],
                valueType: "range",
                source: "",
                tags: []
            }

            const createItem = prepareCreateItem(data)
            expect(createItem).deep.equal({
                name: "test",
                weight: {
                    value: 200,
                    additionalValue: 300,
                },
            })
        })

        it("should add isCa when isCa is defined", () => {
            const data: CreateEditItemForm = {
                name: "test",
                weight: 200,
                unit: "g",
                additionalValue: 300,
                isCa: ["isCa"],
                valueType: "exact",
                source: "",
                tags: []
            }

            const createItem = prepareCreateItem(data)
            expect(createItem).deep.equal({
                name: "test",
                weight: {
                    value: 200,
                    isCa: true,
                },
            })
        })

        it("should add source when source is defined", () => {
            const data: CreateEditItemForm = {
                name: "test",
                weight: 200,
                unit: "g",
                additionalValue: 300,
                isCa: [],
                valueType: "exact",
                source: "http://example.com",
                tags: []
            }

            const createItem = prepareCreateItem(data)
            expect(createItem).deep.equal({
                name: "test",
                weight: {
                    value: 200,
                },
                source: "http://example.com",
            })
        })

        it("should add tags when tags is defined", () => {
            const data: CreateEditItemForm = {
                name: "test",
                weight: 200,
                unit: "g",
                additionalValue: 300,
                isCa: [],
                valueType: "exact",
                source: "",
                tags: ["tag1", "tag2"]
            }

            const createItem = prepareCreateItem(data)
            expect(createItem).deep.equal({
                name: "test",
                weight: {
                    value: 200,
                },
                tags: ["tag1", "tag2"],
            })
        })
    })
})

export { }

