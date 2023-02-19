import { Form, Formik } from "formik"
import "material-symbols"
import { array, object, string } from "yup"
import "../../../styles/global.css"
import { ChipTextInput } from "./ChipTextInput"

const initialValues = {
	tags: ["tag1", "tag2"],
}

const schema = object().shape({
	tags: array().of(string().min(2).max(255)),
})

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<Formik initialValues={initialValues} onSubmit={(values: typeof initialValues) => console.log(values)} validationSchema={schema}>
			<Form>{children}</Form>
		</Formik>
	)
}

describe("Chip Text Input", () => {
	beforeEach(() => {
		cy.mount(
			<Wrapper>
				<ChipTextInput name="tags" labelRequired labelText="Tags" helperText="Helpertext for tags." />
			</Wrapper>
		)
	})

	describe("Basic", () => {
		it("should render the textinput", () => {
			cy.dataCy("chiptextinput-wrapper").should("be.visible")
		})

		it("should render the chips", () => {
			cy.dataCy("chiptextinput-chip-0").should("contain.text", "tag1")
			cy.dataCy("chiptextinput-chip-1").should("contain.text", "tag2")
		})

		it("should render the label", () => {
			cy.dataCy("chiptextinput-label").should("contain.text", "Tags")
		})

		it("should render the helpertext", () => {
			cy.dataCy("chiptextinput-helpertext").should("contain.text", "Helpertext for tags.")
		})
	})

	describe("Add chip and remove chip", () => {
		it("should add a chip when write commas", () => {
			cy.dataCy("chiptextinput-tags-text-input").type("tag3,tag4,")
			cy.dataCy("chiptextinput-chip-2").should("contain.text", "tag3")
			cy.dataCy("chiptextinput-chip-3").should("contain.text", "tag4")
		})

		it("should remove a chip when click chip", () => {
			cy.dataCy("chiptextinput-chip-1").click()
			cy.dataCy("chiptextinput-chip-1").should("not.exist")
		})

		it("should remove a chip when click backspace without filled input", () => {
			cy.dataCy("chiptextinput-tags-text-input").type("{backspace}")
			cy.dataCy("chiptextinput-chip-1").should("not.exist")
		})
	})

	describe("Validation", () => {
		beforeEach(() => {
			cy.dataCy("chiptextinput-tags-text-input").type("a,")
		})

		it("should display chips red when validation fails", () => {
			cy.dataCy("chiptextinput-chip-2").should("have.class", "bg-red-500")
		})

		it("should show errormessage with chip value when validation fails", () => {
			cy.dataCy("chiptextinput-error").should("be.visible")
		})

		it("should hide helpertext when show errormessage", () => {
			cy.dataCy("chiptextinput-helpertext").should("not.exist")
		})
	})
})
