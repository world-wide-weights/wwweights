import { Form, Formik } from "formik";
import Head from "next/head";
import Image from 'next/image';
import logo from '../../../public/logo.png';
import { Button } from "../../components/Button/Button";
import { TextInput } from "../../components/Form/TextInput/TextInput";
import { Headline } from "../../components/Headline/Headline";
import { NextPageWithLayout } from "../_app";

/**
 * Login page is a guest route.
 */
const Login: NextPageWithLayout = () => {
    const initialFormValues = {
        email: "",
        password: ""
    }

    const onFormSubmit = (values: typeof initialFormValues) => {
        console.log(values)
    }

    return (
        <div>
            <Head>
                <title>WWWeights | Login</title>
                <meta charSet="utf-8" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>

            <main className="lg:flex lg:h-screen">
                <div className="flex flex-col justify-center lg:w-1/2">
                    <div className="container mt-5 lg:mt-0">
                        <Image src={logo} alt="Logo" className="min-w-[40px] w-[40px] mb-12 lg:mb-16" />
                        <Headline>Welcome back</Headline>
                        <p className="mb-4 lg:mb-5">Sign in to your account below.</p>

                        <Formik initialValues={initialFormValues} onSubmit={onFormSubmit}>
                            <Form className="mb-5 lg:mb-10">
                                <TextInput name="email" labelText="E-Mail" placeholder="E-Mail" />
                                <TextInput name="password" labelText="Password" placeholder="Password" />
                                <Button kind="tertiary" className="mb-5">Forgot Pasword?</Button>

                                <Button type="submit" className="w-full">Login</Button>
                            </Form>
                        </Formik>

                        <div className="flex">
                            <p className="mr-2">Don&apos;t have an account?</p>
                            <Button kind="tertiary" isColored>Register</Button>
                        </div>
                    </div>
                </div>
                <div className={`hidden lg:flex items-center justify-center bg-background-half-page bg-no-repeat bg-cover bg-center w-1/2`}>
                    <div className="text-white font-bold w-1/2">
                        <h5 className="text-5xl leading-snug mb-5"><span className="text-blue-300">Weight</span> something and wanna share with people?</h5>
                        <h6 className="text-2xl">Login to share your stuff</h6>
                    </div>
                </div>
            </main>
        </div>
    )
}

Login.getLayout = (page: React.ReactElement) => {
    return <>{page}</>
}

export default Login

