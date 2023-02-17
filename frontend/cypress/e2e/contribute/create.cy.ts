
describe("Create Item", () => {
    beforeEach(() => {
        cy.login("/contribute/create")
    })

    describe("Create Process", () => {
        it("should create item when fill all required fields", () => {
            // Fill all required
            cy.dataCy("textinput-name-input").type("apple")
            cy.dataCy("textinput-weight-input").type("150")

            // Mock create and weights page
            cy.mockCreateItem()
            cy.mockDiscoverPage()

            // Submit form
            cy.dataCy("submit-button").click()

            cy.wait("@mockCreateItem")
        })

        it("should create item when fill all fields", () => {
            // Fill required
            cy.dataCy("textinput-name-input").type("apple")
            cy.dataCy("textinput-weight-input").type("150")

            // Select exact
            cy.dataCy("createedit-select-button-range").click()

            // Fill Additional Value
            cy.dataCy("textinput-additionalValue-input").type("300")

            // Select unit
            cy.dataCy("unit-dropdown-button").click()
            cy.dataCy("unit-dropdown-option-kg").click()

            // Set is ca to true
            cy.dataCy("isCa-option-isCa").click()

            // Open details
            cy.dataCy("createedit-open-details-button").click()

            // Fill details
            cy.dataCy("textinput-source-input").type("https://wikipedia.de")
            cy.dataCy("chiptextinput-tags-text-input").type("fruit,healthy,")
            cy.dataCy("imageupload-imageFile-file-input").selectFile({
                contents: Cypress.Buffer.from("file contents"),
                fileName: "file.png",
                lastModified: Date.now(),
            }, { force: true })

            // Mock create and weights page
            cy.mockUploadImage()
            cy.mockCreateItem()
            cy.mockDiscoverPage()
            // Submit form
            cy.dataCy("submit-button").click()

            cy.wait("@mockCreateItem")
        })
    })

    describe("Weights Input", () => {
        it("should display only exact value field when exact is selected", () => {
            cy.dataCy("textinput-weight-input").should("be.visible")
            cy.dataCy("textinput-additionalValue-input").should("not.exist")
        })

        it("should display range value fields when range is selected", () => {
            // Select range
            cy.dataCy("createedit-select-button-range").click()

            cy.dataCy("textinput-additionalValue-input").should("be.visible")
        })
    })

    describe("Input Validation", () => {
        it("should display error when name is empty", () => {
            cy.dataCy("textinput-name-input").type("{enter}").blur()
            cy.dataCy("formerror-name").should("be.visible")
        })

        it("should display error when weight is empty", () => {
            cy.dataCy("textinput-weight-input").type("{enter}").blur()
            cy.dataCy("formerror-weight").should("be.visible")
        })

        it("should display error when range is selected and additionalValue is empty", () => {
            // Select range
            cy.dataCy("createedit-select-button-range").click()

            cy.dataCy("textinput-additionalValue-input").type("{enter}").blur()
            cy.dataCy("formerror-additionalValue").should("be.visible")
        })

        it("should display error when range is selected and additionalValue is less than weight", () => {
            // Select range
            cy.dataCy("createedit-select-button-range").click()

            cy.dataCy("textinput-weight-input").type("100")
            cy.dataCy("textinput-additionalValue-input").type("50").blur()
            cy.dataCy("formerror-additionalValue").should("contain", "Additional value must be greater than weight.")
        })
    })

    describe("Details", () => {
        it("should open details when click \"Add more details\"", () => {
            // Open details
            cy.dataCy("createedit-open-details-button").click()

            cy.dataCy("textinput-source-input").should("be.visible")
        })
    })
})

export { }

