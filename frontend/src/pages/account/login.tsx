import { Form, Formik } from "formik";
import { useState } from "react";
import * as yup from 'yup';
import { Button } from "../../components/Button/Button";
import { TextInput } from "../../components/Form/TextInput/TextInput";
import { AccountLayout } from "../../components/Layout/AccountLayout";
import { routes } from "../../services/routes/routes";
import { NextPageWithLayout } from "../_app";

export type LoginDto = {
    email: string
    password: string
}

/**
 * Login page is a guest route.
 */
const Login: NextPageWithLayout = () => {
    const [isPasswordEyeOpen, setIsPasswordEyeOpen] = useState<boolean>(false)

    // Formik Login Form inital values
    const initialFormValues: LoginDto = {
        email: "",
        password: ""
    }

    // Formik Form Validation
    const validationSchema: yup.SchemaOf<LoginDto> = yup.object().shape({
        email: yup.string().required("E-Mail is required."),
        password: yup.string().required("Password is required.")
    })

    /**
     * Handle submit login form
     * @param values from form
     */
    const onFormSubmit = (values: LoginDto) => {
        console.log(values)
    }

    return <>
        {/* Login Form */}
        <Formik initialValues={initialFormValues} validationSchema={validationSchema} onSubmit={onFormSubmit}>
            {({ dirty, isValid }) => (
                <Form className="mb-5 lg:mb-10">
                    <TextInput name="email" labelText="E-Mail" placeholder="E-Mail" />
                    <TextInput type={isPasswordEyeOpen ? "text" : "password"} name="password" labelText="Password" placeholder="Password" icon={isPasswordEyeOpen ? "visibility" : "visibility_off"} iconOnClick={() => setIsPasswordEyeOpen(!isPasswordEyeOpen)} />
                    <Button kind="tertiary" className="mb-5">Forgot Password?</Button>

                    <Button to={routes.home} disabled={!(dirty && isValid)} type="submit">Login</Button>
                </Form>
            )}
        </Formik>

        {/* Register Text */}
        <div className="flex">
            <p className="mr-2">Don&apos;t have an account?</p>
            <Button to={routes.account.register} kind="tertiary" isColored>Register</Button>
        </div>
    </>
}

Login.getLayout = (page: React.ReactElement) => {
    return <AccountLayout page={page} siteTitle="Login" headline="Welcome back" description="Sign in to your account below." descriptionImage="Login to share your stuff" />
}

export default Login

