import paginatedEditItem from "../../fixtures/items/single.json"

const editItem = paginatedEditItem.data[0]

describe("Edit Item", () => {
    describe("Loading", () => {
        it("should show loading when loading", () => {
            cy.mockSingleItem()
            cy.login(`/contribute/edit/${editItem.slug}`)

            cy.dataCy("skeleton-loading").should("be.visible")
        })
    })

    describe("Basic Edit Process", () => {
        beforeEach(() => {
            cy.mockSingleItem()
            cy.login(`/contribute/edit/${editItem.slug}`)

            cy.wait("@mockSingleItem")
        })

        it("should have all fields filled", () => {
            // General fields
            cy.dataCy("textinput-name-input").should("have.value", editItem.name)
            cy.dataCy("textinput-weight-input").should("have.value", editItem.weight.value)
            cy.dataCy("textinput-additionalValue-input").should("have.value", editItem.weight.additionalValue)
            cy.dataCy("isCa-option-isCa", " input").should("be.checked")

            // Open details
            cy.dataCy("createedit-open-details-button").click()

            // Detail fields
            cy.dataCy("imageupload-imageFile-image").should("be.visible")
            cy.dataCy("textinput-source-input").should("have.value", editItem.source)
            cy.dataCy("chiptextinput-tags-text-input").should("contain.text", editItem.tags)
        })

        it("should edit item when fill fields", () => {
            // General fields
            cy.dataCy("textinput-name-input").clear().type("apple")
            cy.dataCy("textinput-weight-input").clear().type("150")
            cy.dataCy("createedit-select-button-exact").click()

            // Select unit
            cy.dataCy("unit-dropdown-button").click()
            cy.dataCy("unit-dropdown-option-kg").click()

            // Set is ca to false
            cy.dataCy("isCa-option-isCa").click()

            // Open details
            cy.dataCy("createedit-open-details-button").click()

            // Fill details
            cy.dataCy("textinput-source-input").clear().type("https://wikipedia.de")
            cy.dataCy("chiptextinput-tags-text-input").clear().type("fruit,healthy,")
            cy.dataCy("imageupload-imageFile-reset-image").click()
            cy.dataCy("imageupload-imageFile-file-input").selectFile({
                contents: Cypress.Buffer.from("file contents"),
                fileName: "file.png",
                lastModified: Date.now(),
            }, { force: true })

            // Mock create and weights page
            cy.mockUploadImage()
            cy.mockEditItem()
            cy.mockDiscoverPage()

            // Submit form
            cy.dataCy("submit-button").click()

            cy.wait("@mockEditItem")
        })
    })
})

export { }

