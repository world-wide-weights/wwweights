import { Form, Formik } from "formik"
import "material-symbols"
import "../../../styles/global.css"
import { ImageUpload } from "./ImageUpload"

const initialValues = {
    file: ""
}

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <Formik initialValues={initialValues} onSubmit={(values) => console.log(values)} >
        <Form>
            <div className="w-80">
                {children}
            </div>
        </Form>
    </Formik>
}

describe("Image Upload", () => {
    beforeEach(() => {
        cy.mount(<Wrapper>
            <ImageUpload name="file" />
        </Wrapper>)
    })

    describe("Basic", () => {
        it("should render", () => {
            cy.dataCy("imageupload-content").should("be.visible")
        })

        it("should select a file and show preview image", () => {
            cy.dataCy("imageupload-file-input").selectFile({
                contents: Cypress.Buffer.from("file contents"),
                fileName: "file.png",
                lastModified: Date.now(),
            }, { force: true })

            cy.dataCy("imageupload-image").should("be.visible")
        })


        it("should select a file with drag and drop and show preview image", () => {
            cy.dataCy("imageupload-file-input").selectFile({
                contents: Cypress.Buffer.from("file contents"),
                fileName: "file.png",
                lastModified: Date.now(),
            }, { force: true, action: "drag-drop" })

            cy.dataCy("imageupload-image").should("be.visible")
        })

        it("should remove image when clicking on the remove button", () => {
            cy.dataCy("imageupload-file-input").selectFile({
                contents: Cypress.Buffer.from("file contents"),
                fileName: "file.png",
                lastModified: Date.now(),
            }, { force: true })

            cy.dataCy("imageupload-reset-image").click()
            cy.dataCy("imageupload-image").should("not.exist")
        })
    })

    describe("Error", () => {
        it("should not allow a file that is not an image", () => {
            cy.dataCy("imageupload-file-input").selectFile({
                contents: Cypress.Buffer.from("file contents"),
                fileName: "file.xls",
                lastModified: Date.now(),
            }, { force: true })

            // TODO (Zoe-Bot): Implement error test when correct error handling is implemented
            cy.dataCy("imageupload-image").should("not.exist")
        })
    })
})