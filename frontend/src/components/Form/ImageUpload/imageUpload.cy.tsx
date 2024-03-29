import { Form, Formik } from "formik"
import "material-symbols"
import "../../../styles/global.css"
import { ImageUpload } from "./ImageUpload"

const initialValues = {
	file: "",
}

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<Formik initialValues={initialValues} onSubmit={(values: typeof initialValues) => console.log(values)}>
			<Form>{children}</Form>
		</Formik>
	)
}

const NAME = "file"

describe("Image Upload", () => {
	beforeEach(() => {
		cy.mount(
			<Wrapper>
				<ImageUpload name={NAME} />
			</Wrapper>
		)
	})

	describe("Basic", () => {
		it("should render", () => {
			cy.dataCy(`imageupload-${NAME}-content`).should("be.visible")
		})

		it("should select a file and show preview image", () => {
			cy.dataCy(`imageupload-${NAME}-file-input`).selectFile(
				{
					contents: Cypress.Buffer.from("file contents"),
					fileName: "file.png",
					lastModified: Date.now(),
				},
				{ force: true }
			)

			cy.dataCy(`imageupload-${NAME}-image`).should("be.visible")
		})

		it("should select a file with drag and drop and show preview image", () => {
			cy.dataCy(`imageupload-${NAME}-file-input`).selectFile(
				{
					contents: Cypress.Buffer.from("file contents"),
					fileName: "file.png",
					lastModified: Date.now(),
				},
				{ force: true, action: "drag-drop" }
			)

			cy.dataCy(`imageupload-${NAME}-image`).should("be.visible")
		})

		it("should remove image when clicking on the remove button", () => {
			cy.dataCy(`imageupload-${NAME}-file-input`).selectFile(
				{
					contents: Cypress.Buffer.from("file contents"),
					fileName: "file.png",
					lastModified: Date.now(),
				},
				{ force: true }
			)

			cy.dataCy(`imageupload-${NAME}-reset-image`).click()
			cy.dataCy(`imageupload-${NAME}-image`).should("not.exist")
		})
	})

	describe("Error", () => {
		it("should not allow a file that is not an image", () => {
			cy.dataCy(`imageupload-${NAME}-file-input`).selectFile(
				{
					contents: Cypress.Buffer.from("file contents"),
					fileName: "file.xls",
					lastModified: Date.now(),
				},
				{ force: true }
			)

			cy.dataCy(`formerror-${NAME}`).should("be.visible")
			cy.dataCy(`formerror-${NAME}`).should("contain.text", "File type is not supported.")
		})
	})
})
