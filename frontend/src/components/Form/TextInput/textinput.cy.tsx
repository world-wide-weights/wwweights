import { Form, Formik } from "formik"
import "material-symbols"
import { object, string } from "yup"
import "../../../styles/global.css"
import { TextInput } from "./TextInput"

const initialValues = {
    title: ""
}

const schema = object().shape({
    title: string().required("Title is required"),
})

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <Formik initialValues={initialValues} onSubmit={(values: typeof initialValues) => console.log(values)} validationSchema={schema} >
        <Form>
            <div className="w-80">
                {children}
            </div>
        </Form>
    </Formik>
}

const data = {
    name: "title",
    placeholder: "Hello...",
    labelText: "Titel",
    helperText: "The title is shown at the top of the page.",
    type: "email"
}

describe("Text Input", () => {
    describe("Basic Props", () => {
        beforeEach(() => {
            cy.mount(<Wrapper>
                <TextInput name={data.name} placeholder={data.placeholder} labelText={data.labelText} helperText={data.helperText} />
            </Wrapper>)
        })

        it("should set name in input attribute", () => {
            cy.get("input").invoke("attr", "name").should("contain", data.name)
        })

        it("should set labeltext", () => {
            cy.get("label").should("contain", data.labelText)
        })

        it("should set helper text", () => {
            cy.get("p").should("contain", data.helperText)
        })
    })


    it("should have label star when label required", () => {
        cy.mount(<Wrapper>
            <TextInput name={data.name} placeholder={data.placeholder} labelText={data.labelText} labelRequired />
        </Wrapper>)
        cy.get("label").should("contain", "*")
    })

    describe("Icon Prop", () => {
        it("should have icon at the end when set icon", () => {
            cy.mount(<Wrapper>
                <TextInput name={data.name} placeholder={data.placeholder} labelText={data.labelText} icon="face" />
            </Wrapper>)
            cy.get("i.material-symbols-rounded").should("be.visible")
        })

        describe("Iconbutton", () => {
            beforeEach(() => {
                cy.mount(<Wrapper>
                    <TextInput name={data.name} iconOnClick={() => console.log("Onclick")} iconButtonIsSubmit icon="search" />
                </Wrapper>)
            })

            it("should have icon button when iconOnClick is set", () => {
                cy.dataCy("textinput-title-inputwrapper", " button i").should("be.visible")
            })

            it("should have button type submit when iconButtonIsSubmit is set", () => {
                cy.dataCy("textinput-title-inputwrapper", " button").invoke("attr", "type").should("contain", "submit")
            })
        })

        describe("Iconlink", () => {
            beforeEach(() => {
                cy.mount(<Wrapper>
                    <TextInput name={data.name} iconLink="/link" icon="search" />
                </Wrapper>)
            })

            it("should have icon link when iconLink is set", () => {
                cy.dataCy("textinput-title-inputwrapper", " a i").should("be.visible")
            })
        })
    })

    describe("Error", () => {
        beforeEach(() => {
            cy.mount(<Wrapper>
                <TextInput name={data.name} placeholder={data.placeholder} labelText={data.labelText} helperText={data.helperText} />
            </Wrapper>)
        })

        it("should show error message instead of helper text when error occurres", () => {
            cy.get("p").should("contain", data.helperText)
            cy.get("input").focus().blur()
            cy.get("p").should("not.exist")
            cy.get("span").should("contain", "Title is required")
        })

        it("should set error message when error occures", () => {
            cy.get("input").focus().blur()
            cy.get("span").should("contain", "Title is required")
        })
    })
})