import { Form, Formik } from "formik"
import "material-symbols"
import * as yup from "yup"
import "../../../styles/global.css"
import { ChipTextInput } from "./ChipTextInput"

const initialValues = {
    title: ""
}

const submitForm = (values: typeof initialValues) => {
    console.log(values)
}

const schema = yup.object().shape({
    title: yup.string().required("Title is required"),
})

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <Formik initialValues={initialValues} onSubmit={submitForm} validationSchema={schema} >
        <Form>
            <div className="w-80">
                {children}
            </div>
        </Form>
    </Formik>
}

const selectedChips = (chips: string[]) => {
    console.log(chips)
}


describe("Chip Text Input", () => {
    describe("Basic Props", () => {
        beforeEach(() => {
            cy.mount(<Wrapper>
                <ChipTextInput name={"ChipTagInput"} chips={["Hallo, Hey"]} selectedChips={selectedChips} />
            </Wrapper>)
        })

        it("should build component", () => {
            cy.dataCy("chip-text-input").should("exist")
        })
    })
})