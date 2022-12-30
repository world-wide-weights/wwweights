import { Form, Formik } from "formik";
import Head from "next/head";
import Image from 'next/image';
import logo from '../../../public/logo.png';
import { Button } from "../../components/Button/Button";
import { TextInput } from "../../components/Form/TextInput/TextInput";
import { Headline } from "../../components/Headline/Headline";
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
        <Head>
            <title>WWWeights | Login</title>
            <meta charSet="utf-8" />
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>

        <div>
            {/* Header */}
            <Image src={logo} alt="Logo" className="min-w-[40px] w-[40px] mb-12 lg:mb-16" />
            <Headline>Welcome back</Headline>
            <p className="mb-4 lg:mb-5">Sign in to your account below.</p>

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
    return <AccountLayout page={page} />
}

export default Login

