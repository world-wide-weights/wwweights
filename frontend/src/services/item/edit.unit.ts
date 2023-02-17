import { CreateEditItemForm, Item } from "../../types/item"
import { prepareEditItem } from "./edit"

describe("Prepare edit item", () => {
    describe("Add fields", () => {
        it("should add additional value (and other null fields) when valueType is range and additional value is set", () => {
            const oldItem: Item = {
                name: "old name",
                slug: "old-name",
                weight: {
                    value: 200,
                },
                tags: [],
                userId: 1,
                createdAt: 100000000
            }

            const updateItem: CreateEditItemForm = {
                name: "old name",
                weight: 200,
                unit: "g",
                isCa: [],
                valueType: "range",
                additionalValue: 300,
                source: "",
                tags: [],
            }

            const editItem = prepareEditItem(updateItem, oldItem)
            expect(editItem).deep.equal({
                weight: {
                    additionalValue: 300,
                },
                source: null
            })
        })

        it("should add isCa (and other null fields) when isCa is set", () => {
            const oldItem: Item = {
                name: "old name",
                slug: "old-name",
                weight: {
                    value: 200,
                },
                tags: [],
                userId: 1,
                createdAt: 100000000
            }

            const updateItem: CreateEditItemForm = {
                name: "old name",
                weight: 200,
                unit: "g",
                isCa: ["isCa"],
                valueType: "exact",
                source: "",
                tags: [],
            }

            const editItem = prepareEditItem(updateItem, oldItem)
            expect(editItem).deep.equal({
                weight: {
                    isCa: true,
                    additionalValue: null,
                },
                source: null
            })
        })

        it("should add source (and other null fields) when source is set", () => {
            const oldItem: Item = {
                name: "old name",
                slug: "old-name",
                weight: {
                    value: 200,
                },
                tags: [],
                userId: 1,
                createdAt: 100000000
            }

            const updateItem: CreateEditItemForm = {
                name: "old name",
                weight: 200,
                unit: "g",
                isCa: [],
                valueType: "exact",
                source: "https://example.com",
                tags: [],
            }

            const editItem = prepareEditItem(updateItem, oldItem)
            expect(editItem).deep.equal({
                weight: {
                    additionalValue: null,
                },
                source: "https://example.com"
            })
        })
    })

    describe("Update fields", () => {
        it("should add only name (and other null fields) when update name", () => {
            const oldItem: Item = {
                name: "old name",
                slug: "old-name",
                weight: {
                    value: 200,
                },
                tags: [],
                userId: 1,
                createdAt: 100000000
            }

            const updateItem: CreateEditItemForm = {
                name: "new name",
                weight: 200,
                unit: "g",
                isCa: [],
                valueType: "exact",
                source: "",
                tags: [],
            }

            const editItem = prepareEditItem(updateItem, oldItem)
            expect(editItem).deep.equal({
                name: "new name",
                weight: {
                    additionalValue: null,
                },
                source: null
            })
        })

        it("should add only weight value (and other null fields) when update weight", () => {
            const oldItem: Item = {
                name: "old name",
                slug: "old-name",
                weight: {
                    value: 200,
                },
                tags: [],
                userId: 1,
                createdAt: 100000000
            }

            const updateItem: CreateEditItemForm = {
                name: "old name",
                weight: 300,
                unit: "g",
                isCa: [],
                valueType: "exact",
                source: "",
                tags: [],
            }

            const editItem = prepareEditItem(updateItem, oldItem)
            expect(editItem).deep.equal({
                weight: {
                    value: 300,
                    additionalValue: null,
                },
                source: null
            })
        })

        it("should add only weight isCa (and other null fields) when update isCa", () => {
            const oldItem: Item = {
                name: "old name",
                slug: "old-name",
                weight: {
                    value: 200,
                },
                tags: [],
                userId: 1,
                createdAt: 100000000
            }

            const updateItem: CreateEditItemForm = {
                name: "old name",
                weight: 200,
                unit: "g",
                isCa: ["isCa"],
                valueType: "exact",
                source: "",
                tags: [],
            }

            const editItem = prepareEditItem(updateItem, oldItem)
            expect(editItem).deep.equal({
                weight: {
                    isCa: true,
                    additionalValue: null,
                },
                source: null
            })
        })

        it("should add only weight additionalValue (and other null fields) when update additionalValue", () => {
            const oldItem: Item = {
                name: "old name",
                slug: "old-name",
                weight: {
                    value: 200,
                },
                tags: [],
                userId: 1,
                createdAt: 100000000
            }

            const updateItem: CreateEditItemForm = {
                name: "old name",
                weight: 200,
                unit: "g",
                isCa: [],
                valueType: "range",
                additionalValue: 10,
                source: "",
                tags: [],
            }

            const editItem = prepareEditItem(updateItem, oldItem)
            expect(editItem).deep.equal({
                weight: {
                    additionalValue: 10,
                },
                source: null
            })
        })

        it("should add only source (and other null fields) when update source", () => {
            const oldItem: Item = {
                name: "old name",
                slug: "old-name",
                weight: {
                    value: 200,
                },
                tags: [],
                userId: 1,
                createdAt: 100000000
            }

            const updateItem: CreateEditItemForm = {
                name: "old name",
                weight: 200,
                unit: "g",
                isCa: [],
                valueType: "exact",
                source: "new source",
                tags: [],
            }

            const editItem = prepareEditItem(updateItem, oldItem)
            expect(editItem).deep.equal({
                weight: {
                    additionalValue: null,
                },
                source: "new source",
            })
        })
    })

    describe("Remove fields", () => {
        it("should only add additional value null (and other null fields) when update valueType to exact", () => {
            const oldItem: Item = {
                name: "old name",
                slug: "old-name",
                weight: {
                    value: 200,
                    additionalValue: 300,
                },
                tags: [],
                userId: 1,
                createdAt: 100000000
            }

            const updateItem: CreateEditItemForm = {
                name: "old name",
                weight: 200,
                unit: "g",
                additionalValue: 300,
                isCa: [],
                valueType: "exact",
                source: "",
                tags: [],
            }

            const editItem = prepareEditItem(updateItem, oldItem)
            expect(editItem).deep.equal({
                weight: {
                    additionalValue: null,
                },
                source: null
            })
        })

        it("should only add additional value null (and other null fields) when update valueType to exact and additionalValue is null", () => {
            const oldItem: Item = {
                name: "old name",
                slug: "old-name",
                weight: {
                    value: 200,
                    additionalValue: 300,
                },
                tags: [],
                userId: 1,
                createdAt: 100000000
            }

            const updateItem: CreateEditItemForm = {
                name: "old name",
                weight: 200,
                unit: "g",
                additionalValue: "",
                isCa: [],
                valueType: "exact",
                source: "",
                tags: [],
            }

            const editItem = prepareEditItem(updateItem, oldItem)
            expect(editItem).deep.equal({
                weight: {
                    additionalValue: null,
                },
                source: null
            })
        })

        it("should only add source null (and other null fields) when update source to empty string", () => {
            const oldItem: Item = {
                name: "old name",
                slug: "old-name",
                weight: {
                    value: 200,
                },
                tags: [],
                userId: 1,
                createdAt: 100000000
            }

            const updateItem: CreateEditItemForm = {
                name: "old name",
                weight: 200,
                unit: "g",
                isCa: [],
                valueType: "exact",
                source: "",
                tags: [],
            }

            const editItem = prepareEditItem(updateItem, oldItem)
            expect(editItem).deep.equal({
                weight: {
                    additionalValue: null,
                },
                source: null
            })
        })

        it("should only add image null when remove image", () => {
            const oldItem: Item = {
                name: "old name",
                slug: "old-name",
                weight: {
                    value: 200,
                },
                tags: [],
                userId: 1,
                image: "5678900009.jpg",
                createdAt: 100000000,
            }

            const updateItem: CreateEditItemForm = {
                name: "old name",
                weight: 200,
                unit: "g",
                isCa: [],
                valueType: "exact",
                imageFile: null,
                source: "",
                tags: [],
            }

            const editItem = prepareEditItem(updateItem, oldItem)
            expect(editItem).deep.equal({
                weight: {
                    additionalValue: null,
                },
                source: null,
                image: null
            })
        })
    })

    describe("Edit tags", () => {
        it("should only add push and pull to tags (and other null fields) when update tags", () => {
            const oldItem: Item = {
                name: "old name",
                slug: "old-name",
                weight: {
                    value: 200,
                },
                tags: [{
                    name: "tag1",
                    count: 1,
                }],
                userId: 1,
                createdAt: 100000000
            }

            const updateItem: CreateEditItemForm = {
                name: "old name",
                weight: 200,
                unit: "g",
                isCa: [],
                valueType: "exact",
                source: "",
                tags: ["tag2"],
            }

            const editItem = prepareEditItem(updateItem, oldItem)
            expect(editItem).deep.equal({
                weight: {
                    additionalValue: null,
                },
                source: null,
                tags: {
                    pull: ["tag1"],
                    push: ["tag2"],
                },
            })
        })

        it("should add only push to tags (and other null fields) when add tags", () => {
            const oldItem: Item = {
                name: "old name",
                slug: "old-name",
                weight: {
                    value: 200,
                },
                tags: [],
                userId: 1,
                createdAt: 100000000
            }

            const updateItem: CreateEditItemForm = {
                name: "old name",
                weight: 200,
                unit: "g",
                isCa: [],
                valueType: "exact",
                source: "",
                tags: ["tag1", "tag2"],
            }

            const editItem = prepareEditItem(updateItem, oldItem)
            expect(editItem).deep.equal({
                weight: {
                    additionalValue: null,
                },
                source: null,
                tags: {
                    push: ["tag1", "tag2"],
                },
            })
        })

        it("should add only pull to tags (and other null fields) when remove tags", () => {
            const oldItem: Item = {
                name: "old name",
                slug: "old-name",
                weight: {
                    value: 200,
                },
                tags: [{
                    name: "tag1",
                    count: 1
                }, {
                    name: "tag2",
                    count: 1
                }],
                userId: 1,
                createdAt: 100000000
            }

            const updateItem: CreateEditItemForm = {
                name: "old name",
                weight: 200,
                unit: "g",
                isCa: [],
                valueType: "exact",
                source: "",
                tags: [],
            }

            const editItem = prepareEditItem(updateItem, oldItem)
            expect(editItem).deep.equal({
                weight: {
                    additionalValue: null,
                },
                source: null,
                tags: {
                    pull: ["tag1", "tag2"],
                },
            })
        })
    })
})

export { }

