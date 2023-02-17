import { Form, Formik } from "formik"
import { useRouter } from "next/router"
import { useState } from "react"
import { object, SchemaOf, string } from "yup"
import { Button } from "../../components/Button/Button"
import { TextInput } from "../../components/Form/TextInput/TextInput"
import { AccountLayout } from "../../components/Layout/AccountLayout"
import { Seo } from "../../components/Seo/Seo"
import { login } from "../../services/auth/login"
import { routes } from "../../services/routes/routes"
import { NextPageCustomProps } from "../_app"

export type LoginDto = {
    email: string
    password: string
}

/**
 * Login page is a guest route.
 */
const Login: NextPageCustomProps = () => {
    const router = useRouter()

    // Local State
    const [isPasswordEyeOpen, setIsPasswordEyeOpen] = useState<boolean>(false)
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    // Formik Form Initial Values
    const initialFormValues: LoginDto = {
        email: "",
        password: ""
    }

    // Formik Form Validation
    const validationSchema: SchemaOf<LoginDto> = object().shape({
        email: string().email("Please enter a valid E-Mail.").required("E-Mail is required."),
        password: string().required("Password is required.")
    })

    /**
     * Handle submit login form.
     * @param values input from form
     */
    const onFormSubmit = async (values: LoginDto) => {
        setIsLoading(true)
        const response = await login({
            email: values.email,
            password: values.password
        })

        if (response === null) {
            setIsLoading(false)
            setError("Something went wrong. Try again or come later.")
            return
        }

        if ("statusCode" in response) {
            setIsLoading(false)
            setError(`${response.statusCode}: ${response.message}`)
            return
        }

        // Login successful -> redirect to callbackUrl
        const callbackUrl = router.asPath.split("?callbackUrl=")[1] ?? routes.home
        router.push(callbackUrl)
    }

    return <>
        <Seo
            title="Login"
            description="Login to your account to start contributing items to the community."
        />
        {/* Login Form */}
        <Formik initialValues={initialFormValues} validationSchema={validationSchema} onSubmit={onFormSubmit}>
            {({ dirty, isValid }) => (
                <Form className="mb-5 lg:mb-10">
                    <TextInput autoComplete="username" type="email" name="email" labelText="E-Mail" placeholder="E-Mail" />
                    <TextInput autoComplete="current-password" type={isPasswordEyeOpen ? "text" : "password"} name="password" labelText="Password" placeholder="Password" icon={isPasswordEyeOpen ? "visibility" : "visibility_off"} iconOnClick={() => setIsPasswordEyeOpen(!isPasswordEyeOpen)} />

                    <Button className="mt-5" datacy="login-button" loading={isLoading} icon="login" disabled={!(dirty && isValid)} type="submit">Login</Button>
                </Form>
            )}
        </Formik>

        {/* TODO (Zoe-Bot): Add correct error handling */}
        {error && <p className="py-2">Error: {error}</p>}

        {/* Register Text */}
        <div className="flex">
            <p className="mr-2">Don&apos;t have an account?</p>
            <Button to={routes.account.register} kind="tertiary" isColored>Register</Button>
        </div>
    </>
}

// Sets custom account layout
Login.layout = (page: React.ReactElement) => {
    return <AccountLayout
        page={page}
        headline="Welcome back"
        description="Sign in to your account below."
        sloganHeadline={<><span className="text-blue-300">Weigh</span> something and wanna share it with people?</>}
        sloganDescription="Login to share your stuff." />
}

// Sets guest route (user need to be logged out)
Login.auth = {
    routeType: "guest"
}

export default Login

