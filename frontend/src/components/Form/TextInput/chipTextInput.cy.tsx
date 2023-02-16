import { Form, Formik } from "formik"
import "material-symbols"
import * as yup from "yup"
import "../../../styles/global.css"
import { ChipTextInput } from "./ChipTextInput"

const initialValues = {
    tags: ["tag1", "tag2", "tag3"]
}

const schema = yup.object().shape({
    title: yup.string().required("Title is required"),
})

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <Formik initialValues={initialValues} onSubmit={(values: typeof initialValues) => console.log(values)} validationSchema={schema} >
        <Form>
            {children}
        </Form>
    </Formik>
}

describe("Chip Text Input", () => {
    describe("Basic Props", () => {
        beforeEach(() => {
            cy.mount(<Wrapper>
                <ChipTextInput name="tags" />
            </Wrapper>)
        })

        it("should render the textinput", () => {
        })

        it("should render the chips", () => {
        })

        it("should render the label", () => {

        })
    })
})