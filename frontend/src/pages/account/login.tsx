import { Form, Formik } from "formik"
import { signIn, SignInResponse } from "next-auth/react"
import { useRouter } from "next/router"
import { useMemo, useState } from "react"
import * as yup from "yup"
import { Button } from "../../components/Button/Button"
import { TextInput } from "../../components/Form/TextInput/TextInput"
import { AccountLayout } from "../../components/Layout/AccountLayout"
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
    // Redirect to page where you clicked login
    const callbackUrl = useMemo(() => typeof router.query.callbackUrl == "string" ? router.query.callbackUrl : router.query.callbackUrl?.[0] ?? null, [router])

    // Local State
    const [isPasswordEyeOpen, setIsPasswordEyeOpen] = useState<boolean>(false)
    const [error, setError] = useState("")

    // Formik Form Initial Values
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
     * Handle submit login form.
     * @param values input from form
     */
    const onFormSubmit = async (values: LoginDto) => {
        try {
            // Sign in with next auth
            const response = await signIn("credentials", {
                redirect: false,
                email: values.email,
                password: values.password,
            }) as SignInResponse

            // When everything was ok go to url we was before login or home
            if (response.ok) {
                router.push(callbackUrl ?? routes.home)
            } else if (response.error) {
                setError(response.error)
            }
        } catch (error) {
            console.error(error)
        }
    }

    return <>
        {/* Login Form */}
        <Formik initialValues={initialFormValues} validationSchema={validationSchema} onSubmit={onFormSubmit}>
            {({ dirty, isValid }) => (
                <Form className="mb-5 lg:mb-10">
                    <TextInput name="email" labelText="E-Mail" placeholder="E-Mail" />
                    <TextInput type={isPasswordEyeOpen ? "text" : "password"} name="password" labelText="Password" placeholder="Password" icon={isPasswordEyeOpen ? "visibility" : "visibility_off"} iconOnClick={() => setIsPasswordEyeOpen(!isPasswordEyeOpen)} />
                    <Button kind="tertiary" className="mb-5">Forgot Password?</Button>

                    <Button datacy="login-button" disabled={!(dirty && isValid)} type="submit">Login</Button>
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
Login.getLayout = (page: React.ReactElement) => {
    return <AccountLayout page={page} siteTitle="Login" headline="Welcome back" description="Sign in to your account below." descriptionImage="Login to share your stuff." />
}

// Sets guest route (user need to be logged out)
Login.auth = {
    routeType: "guest"
}

export default Login

