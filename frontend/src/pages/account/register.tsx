import { Form, Formik } from "formik";
import { Button } from "../../components/Button/Button";
import { TextInput } from "../../components/Form/TextInput/TextInput";
import { AccountLayout } from "../../components/Layout/AccountLayout";
import { routes } from "../../services/routes/routes";
import { NextPageWithLayout } from "../_app";

/**
 * Login page is a guest route.
 */
const Register: NextPageWithLayout = () => {

    // Formik Register Form inital values
    const initialFormValues = {
        email: "",
        username: "",
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
        {/* Login Form */}
        <Formik initialValues={initialFormValues} onSubmit={onFormSubmit}>
            <Form className="mb-5 lg:mb-10">
                <TextInput name="email" labelText="E-Mail" placeholder="E-Mail" />
                <TextInput name="username" labelText="Username" placeholder="Username" />
                <TextInput name="password" labelText="Password" placeholder="Password" />

                <Button to={routes.home} type="submit" className="md:mt-8">Register</Button>
            </Form>
        </Formik>

        {/* Register Text */}
        <div className="flex">
            <p className="mr-2">Already have an account?</p>
            <Button to={routes.account.login} kind="tertiary" isColored>Login</Button>
        </div>
    </>
}

Register.getLayout = (page: React.ReactElement) => {
    return <AccountLayout page={page} siteTitle="Register" headline="Create your account" description="Start for free." descriptionImage="Register to share your stuff" />
}

export default Register

