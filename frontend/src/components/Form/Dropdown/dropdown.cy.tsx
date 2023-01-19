import { Form, Formik } from "formik"
import "material-symbols"
import React from "react"
import "../../../styles/global.css"
import { Dropdown } from "./Dropdown"

const initialValues = {
    filter: ""
}

const submitForm = (values: typeof initialValues) => {
    console.log(values)
}

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <Formik initialValues={initialValues} onSubmit={submitForm}>
        <Form>
            <div className="w-80">
                {children}
            </div>
        </Form>
    </Formik>
}

const data = {
    name: "filter",
    placeholder: "Choose a filter...",
    options: [
        {
            value: 1,
            label: "Relevance"
        },
        {
            value: 2,
            label: "Das ist ein sehr langer Text für ein Dropdown item",
            icon: "face"
        },
        {
            value: 3,
            label: "Lightest",
            icon: "face"
        }
    ]
}

describe("Dropdown", () => {
    beforeEach(() => {
        cy.mount(<Wrapper>
            <Dropdown name={data.name} options={data.options} placeholder={data.placeholder} />
        </Wrapper>)
    })

    it("should initial set placeholder", () => {
        cy.dataCy(`${data.name}-dropdown-button`, " span").should("contain", data.placeholder)
    })

    it("should set options in dropdown", () => {
        // open dropdown
        cy.dataCy(`${data.name}-dropdown-button`).click()

        data.options.forEach((option) => {
            cy.dataCy(`${data.name}-dropdown-option-${option.value}`).should("contain", option.label)
        })
    })

    it("should open dropdown when click it", () => {
        // open dropdown
        cy.dataCy(`${data.name}-dropdown-button`).click()

        cy.dataCy(`${data.name}-dropdown-menu`).should("be.visible")
    })

    it("should close dropdown when click it after its open", () => {
        // open dropdown
        cy.dataCy(`${data.name}-dropdown-button`).click({ force: true })

        // close dropdown
        cy.dataCy(`${data.name}-dropdown-button`).click({ force: true })
        cy.dataCy(`${data.name}-dropdown-menu`).should("not.exist")
    })

    it("should close dropdown when click outside dropdown", () => {
        // open dropdown
        cy.dataCy(`${data.name}-dropdown-button`).click()

        // close dropdown
        cy.get("body").click()
        cy.dataCy(`${data.name}-dropdown-menu`).should("not.exist")
    })

    it("should set correct item when click on it", () => {
        // open dropdown
        cy.dataCy(`${data.name}-dropdown-button`).click()

        // select first item
        cy.dataCy(`${data.name}-dropdown-option-${data.options[0].value}`).click()

        cy.dataCy(`${data.name}-dropdown-button`).should("contain", data.options[0].label)
    })

    it("should close dropdown after select element", () => {
        // open dropdown
        cy.dataCy(`${data.name}-dropdown-button`).click()

        // select first item
        cy.dataCy(`${data.name}-dropdown-option-${data.options[0].value}`).click()

        cy.dataCy(`${data.name}-dropdown-menu`).should("not.exist")
    })

    it("should have icon chevron-down when dropdown is closed", () => {
        cy.dataCy(`${data.name}-dropdown-button`, " i").should("have.class", "rotate-0")
    })

    it("should have icon rotate-180 when dropdown is open", () => {
        // open dropdown
        cy.dataCy(`${data.name}-dropdown-button`).click()

        cy.dataCy(`${data.name}-dropdown-button`, " i").should("have.class", "-rotate-180")
    })
})
