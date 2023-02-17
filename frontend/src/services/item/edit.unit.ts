import { CreateEditItemForm, Item } from "../../types/item"
import { prepareEditItem } from "./edit"

describe("Prepare edit item", () => {
    describe("Add fields", () => {
        it("should only add additional value when valueType is range and additional value is updated", () => {
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
                }
            })
        })

        it("should only add isCa when isCa is updated", () => {
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
                    isCa: true
                }
            })
        })

        it("should only add source when source is updated", () => {
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
                source: "https://example.com"
            })
        })
    })

    describe("Update fields", () => {
        it("should only update name when name is updated", () => {
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
                name: "new name"
            })
        })

        it("should only add weight value when weight is updated", () => {
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
                    value: 300
                }
            })
        })

        it("should only add weight isCa when isCa is updated", () => {
            const oldItem: Item = {
                name: "old name",
                slug: "old-name",
                weight: {
                    value: 200,
                    isCa: false
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
                    isCa: true
                }
            })
        })

        it("should add only weight additionalValue when update additionalValue", () => {
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
                }
            })
        })

        it("should add only source when update source", () => {
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
                source: "new source",
            })
        })

        it("should update source when source is not equal to the old source", () => {
            const oldItem: Item = {
                name: "old name",
                slug: "old-name",
                weight: {
                    value: 200,
                },
                tags: [],
                userId: 1,
                createdAt: 100000000,
                source: "https://old.com"
            }

            const updateItem: CreateEditItemForm = {
                name: "old name",
                weight: 200,
                unit: "g",
                isCa: [],
                valueType: "exact",
                source: "https://new.com",
                tags: [],
            }

            const editItem = prepareEditItem(updateItem, oldItem)
            expect(editItem).deep.equal({
                source: "https://new.com",
            })
        })

        it("should return empty objects when no updates where made", () => {
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
            expect(editItem).deep.equal({})
        })
    })

    describe("Remove fields", () => {
        it("should only add additional value null when update valueType to exact", () => {
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
                }
            })
        })

        it("should only add additional value null when update valueType to exact and additionalValue is null", () => {
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
                }
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
                image: null
            })
        })
    })

    describe("Edit tags", () => {
        it("should only add push and pull to tags when update tags", () => {
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
                tags: {
                    pull: ["tag1"],
                    push: ["tag2"],
                },
            })
        })

        it("should add only push to tags when add tags", () => {
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
                tags: {
                    push: ["tag1", "tag2"],
                },
            })
        })

        it("should add only pull to tags when remove tags", () => {
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
                tags: {
                    pull: ["tag1", "tag2"],
                },
            })
        })
    })
})

export { }

