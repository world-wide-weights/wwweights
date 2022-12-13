import { Form, Formik } from "formik";
import 'material-symbols';
import * as yup from 'yup';
import '../../../styles/global.css';
import { TextInput } from "./TextInput";

const initialValues = {
    title: ""
}

const submitForm = (values: typeof initialValues) => {
    console.log(values);
}

const schema = yup.object().shape({
    title: yup.string().required("Title is required"),
})

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <Formik initialValues={initialValues} onSubmit={submitForm} validationSchema={schema} >
        {(formik) => (
            <Form>
                <div className="w-80">
                    {children}
                </div>
            </Form>
        )}
    </Formik>
}

describe('Text Input', () => {
    const data = {
        name: "title",
        placeholder: "Hello...",
        labelText: "Titel",
        helperText: "The title is shown at the top of the page.",
        type: "email"
    }

    describe('Props', () => {
        beforeEach(() => {
            cy.mount(<Wrapper>
                <TextInput name={data.name} placeholder={data.placeholder} labelText={data.labelText} helperText={data.helperText} />
            </Wrapper>)
        })

        it('should set name in input attribute', () => {
            cy.get('input').invoke('attr', 'name').should('contain', data.name)
        })

        it('should set labeltext', () => {
            cy.get('label').should('contain', data.labelText)
        })

        it('should set helper text', () => {
            cy.get('p').should('contain', data.helperText)
        })
    })


    it('should have label star when label required', () => {
        cy.mount(<Wrapper>
            <TextInput name={data.name} placeholder={data.placeholder} labelText={data.labelText} labelRequired />
        </Wrapper>)
        cy.get('label').should('contain', '*')
    })

    it('should have icon at the end when set icon', () => {
        cy.mount(<Wrapper>
            <TextInput name={data.name} placeholder={data.placeholder} labelText={data.labelText} icon="face" />
        </Wrapper>)
        cy.get('i.material-symbols-rounded').should('be.visible')
    })

    describe('Error', () => {
        beforeEach(() => {
            cy.mount(<Wrapper>
                <TextInput name={data.name} placeholder={data.placeholder} labelText={data.labelText} helperText={data.helperText} />
            </Wrapper>)
        })

        it('should show error message instead of helper text when error occurres', () => {
            cy.get('p').should('contain', data.helperText)
            cy.get('input').focus().blur()
            cy.get('p').should('not.exist')
            cy.get('span').should('contain', 'Title is required')
        })

        it('should set error message when error occures', () => {
            cy.get('input').focus().blur()
            cy.get('span').should('contain', 'Title is required')
        })
    })
})