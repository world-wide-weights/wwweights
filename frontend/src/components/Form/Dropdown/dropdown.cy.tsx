import { Form, Formik } from "formik";
import 'material-symbols';
import React from "react";
import '../../../styles/global.css';
import { Dropdown } from './Dropdown';

const initialValues = {
    filter: ""
}

const submitForm = (values: typeof initialValues) => {
    console.log(values);
}

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <Formik initialValues={initialValues} onSubmit={submitForm}>
        {(formik) => (
            <Form>
                <div className="w-80">
                    {children}
                </div>
            </Form>
        )}
    </Formik>
}

describe('Dropdown', () => {
    const data = {
        name: "filter",
        placeholder: "Choose a filter...",
        options: [
            {
                id: 1,
                label: "Relevance"
            },
            {
                id: 2,
                label: "Das ist ein sehr langer Text für ein Dropdown item",
                icon: "face"
            },
            {
                id: 3,
                label: "Lightest",
                icon: "face"
            }
        ]
    }

    beforeEach(() => {
        cy.mount(<Wrapper>
            <Dropdown name={data.name} options={data.options} placeholder={data.placeholder} />
        </Wrapper>)
    })

    it('should initial set placeholder', () => {
        cy.get(`[data-cy="${data.name}-dropdown-button"] span`).should('contain', data.placeholder)
    })

    it('should set options in dropdown', () => {
        // open dropdown
        cy.get(`[data-cy="${data.name}-dropdown-button"]`).click()

        data.options.forEach((option) => {
            cy.get(`[data-cy="${data.name}-dropdown-option-${option.id}"]`).should('contain', option.label)
        })
    })

    it('should open dropdown when click it', () => {
        // open dropdown
        cy.get(`[data-cy="${data.name}-dropdown-button"]`).click()

        cy.get(`[data-cy="${data.name}-dropdown-menu"]`).should('be.visible')
    })

    it('should close dropdown when click it after its open', () => {
        // open dropdown
        cy.get(`[data-cy="${data.name}-dropdown-button"]`).click({ force: true })
        cy.get(`[data-cy="${data.name}-dropdown-menu"]`).should('be.visible')

        // close dropdown
        cy.get(`[data-cy="${data.name}-dropdown-button"]`).click({ force: true })
        cy.get(`[data-cy="${data.name}-dropdown-menu"]`).should('not.exist')
    })

    it('should close dropdown when click outside dropdown', () => {
        // open dropdown
        cy.get(`[data-cy="${data.name}-dropdown-button"]`).click()
        cy.get(`[data-cy="${data.name}-dropdown-menu"]`).should('be.visible')

        // close dropdown
        cy.get('body').click()
        cy.get(`[data-cy="${data.name}-dropdown-menu"]`).should('not.exist')
    })

    it('should set correct item when click on it', () => {
        // open dropdown
        cy.get(`[data-cy="${data.name}-dropdown-button"]`).click()
        cy.get(`[data-cy="${data.name}-dropdown-menu"]`).should('be.visible')

        // select first item
        cy.get(`[data-cy="${data.name}-dropdown-option-${data.options[0].id}"]`).click()

        cy.get(`[data-cy="${data.name}-dropdown-button"]`).should('contain', data.options[0].label)
    })

    it('should close dropdown after select element', () => {
        // open dropdown
        cy.get(`[data-cy="${data.name}-dropdown-button"]`).click()
        cy.get(`[data-cy="${data.name}-dropdown-menu"]`).should('be.visible')

        // select first item
        cy.get(`[data-cy="${data.name}-dropdown-option-${data.options[0].id}"]`).click()

        cy.get(`[data-cy="${data.name}-dropdown-menu"]`).should('not.exist')
    })

    it('should have icon chevron-down when dropdown is closed', () => {
        cy.get(`[data-cy="${data.name}-dropdown-button"] i`).should('have.class', 'rotate-0')
    })

    it('should have icon rotate-180 when dropdown is open', () => {
        // open dropdown
        cy.get(`[data-cy="${data.name}-dropdown-button"]`).click()
        cy.get(`[data-cy="${data.name}-dropdown-menu"]`).should('be.visible')

        cy.get(`[data-cy="${data.name}-dropdown-button"] i`).should('have.class', '-rotate-180')
    })
})
