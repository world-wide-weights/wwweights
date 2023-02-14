import { Form, Formik } from "formik"
import "material-symbols"
import "../../../styles/global.css"
import { Button } from "../../Button/Button"
import { CheckboxList } from "./CheckboxList"

const initialValues = {
    box: ""
}

const submitForm = (values: typeof initialValues) => {
    console.log(values)
}

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <Formik initialValues={initialValues} onSubmit={submitForm} >
        <Form>
            {children}
        </Form>
    </Formik>
}

const data = {
    name: "box",
    labelText: "Box",
    helperText: "Press the box.",
    options: [
        {
            value: 1,
            label: "Box 1"
        },
        {
            value: 2,
            label: "Box 2",
            icon: "face"
        },
        {
            value: 3,
            label: "Box 3",
            icon: "face"
        }
    ]
}

describe("CheckboxList", () => {
    describe("Base", () => {
        beforeEach(() => {
            cy.mount(<Wrapper>
                <CheckboxList name={data.name} options={data.options} labelText={data.labelText} />
                <Button kind="primary" type="submit" className="mt-2">Hello</Button>
            </Wrapper>)
        })

        it("should set labeltext", () => {
            cy.get("h5 ").should("contain", data.labelText)
        })

        it("should display all options", () => {
            data.options.forEach((option) => {
                cy.dataCy(`${data.name}-option-${option.value}`).should("contain", option.label)
            })
        })

        it("should check box when click on it", () => {
            cy.dataCy(`${data.name}-option-${data.options[0].value}`, " input").check().should("be.checked")
            cy.dataCy(`${data.name}-option-${data.options[1].value}`, " input").should("not.be.checked")
        })

        it("should uncheck box when click on it after it is checked", () => {
            cy.dataCy(`${data.name}-option-${data.options[0].value}`, " input").check().should("be.checked")
            cy.dataCy(`${data.name}-option-${data.options[0].value}`, " input").click().should("not.be.checked")
        })

        it("should display icon before label when defined", () => {
            cy.dataCy(`${data.name}-option-${data.options[1].value}`, " i").should("be.visible")
        })

        it("should not display icon before label when not defined", () => {
            cy.dataCy(`${data.name}-option-${data.options[0].value}`, " i").should("not.exist")
        })
    })

    describe("Helpertext", () => {
        it("should set helper text", () => {
            cy.mount(<Wrapper>
                <CheckboxList name={data.name} options={data.options} labelText={data.labelText} helperText={data.helperText} />
                <Button kind="primary" type="submit" className="mt-2">Hello</Button>
            </Wrapper>)

            cy.dataCy(`${data.name}-helpertext`).should("contain", data.helperText)
        })

        it("should not show helper text", () => {
            cy.mount(<Wrapper>
                <CheckboxList name={data.name} options={data.options} labelText={data.labelText} />
                <Button kind="primary" type="submit" className="mt-2">Hello</Button>
            </Wrapper>)

            cy.dataCy(`${data.name}-helpertext`).should("not.exist")
        })
    })
})