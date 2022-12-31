import { Form, Formik } from "formik";
import * as yup from 'yup';
import { Button } from "../../components/Button/Button";
import { TextInput } from "../../components/Form/TextInput/TextInput";
import { AccountLayout } from "../../components/Layout/AccountLayout";
import { routes } from "../../services/routes/routes";
import { NextPageCustomProps } from "../_app";

type RegisterDto = {
    email: string
    username: string
    password: string
}

/**
 * Register page is a guest route.
 */
const Register: NextPageCustomProps = () => {

    // Formik Form Initial Values
    const initialFormValues: RegisterDto = {
        email: "",
        username: "",
        password: ""
    }

    // Formik Form Validation
    const validationSchema: yup.SchemaOf<RegisterDto> = yup.object().shape({
        email: yup.string().email("Must be a valid E-Mail.").required("E-Mail is required."),
        username: yup.string().min(3).max(20).required("E-Mail is required."),
        password: yup.string().min(8).max(128).required("Password is required.")
    })

    /**
     * Handle submit register form.
     * @param values input from form
     */
    const onFormSubmit = (values: RegisterDto) => {
        console.log(values)
    }

    return <>
        {/* Register Form */}
        <Formik initialValues={initialFormValues} validationSchema={validationSchema} onSubmit={onFormSubmit}>
            {({ dirty, isValid }) => (
                <Form className="mb-5 lg:mb-10">
                    <TextInput name="email" labelText="E-Mail" placeholder="E-Mail" />
                    <TextInput name="username" labelText="Username" placeholder="Username" />
                    <TextInput name="password" labelText="Password" placeholder="Password" />

                    <Button to={routes.home} type="submit" disabled={!(dirty && isValid)} className="md:mt-8">Register</Button>
                </Form>
            )}
        </Formik>

        {/* Register Text */}
        <div className="flex">
            <p className="mr-2">Already have an account?</p>
            <Button to={routes.account.login} kind="tertiary" isColored>Login</Button>
        </div>
    </>
}

// Sets custom account layout
Register.getLayout = (page: React.ReactElement) => {
    return <AccountLayout page={page} siteTitle="Register" headline="Create your account" description="Start for free." descriptionImage="Register to share your stuff." />
}

export default Register

