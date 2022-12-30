import { Form, Formik } from "formik";
import { Button } from "../../components/Button/Button";
import { TextInput } from "../../components/Form/TextInput/TextInput";
import { AccountLayout } from "../../components/Layout/AccountLayout";
import { NextPageWithLayout } from "../_app";

/**
 * Login page is a guest route.
 */
const Login: NextPageWithLayout = () => {

    // Formik Login Form inital values
    const initialFormValues = {
        email: "",
        password: ""
    }

    /**
     * Handle submit login form
     * @param values from form
     */
    const onFormSubmit = (values: typeof initialFormValues) => {
        console.log(values)
    }

    return <>
        <div>
            {/* Login Form */}
            <Formik initialValues={initialFormValues} onSubmit={onFormSubmit}>
                <Form className="mb-5 lg:mb-10">
                    <TextInput name="email" labelText="E-Mail" placeholder="E-Mail" />
                    <TextInput name="password" labelText="Password" placeholder="Password" />
                    <Button kind="tertiary" className="mb-5">Forgot Pasword?</Button>

                    <Button type="submit" className="w-full">Login</Button>
                </Form>
            </Formik>

            {/* Register Text */}
            <div className="flex">
                <p className="mr-2">Don&apos;t have an account?</p>
                <Button kind="tertiary" isColored>Register</Button>
            </div>
        </div>
    </>
}

Login.getLayout = (page: React.ReactElement) => {
    return <AccountLayout page={page} siteTitle="Login" headline="Welcome back" description="Sign in to your account below." />
}

export default Login

