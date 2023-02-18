import { Form, Formik } from "formik"
import { useRouter } from "next/router"
import { useState } from "react"
import { object, ObjectSchema, string } from "yup"
import { Button } from "../../components/Button/Button"
import { TextInput } from "../../components/Form/TextInput/TextInput"
import { AccountLayout } from "../../components/Layout/AccountLayout"
import { Seo } from "../../components/Seo/Seo"
import { register } from "../../services/auth/register"
import { routes } from "../../services/routes/routes"
import { NextPageCustomProps } from "../_app"

type RegisterDto = {
    email: string
    username: string
    password: string
}

/**
 * Register page is a guest route.
 */
const Register: NextPageCustomProps = () => {
    const router = useRouter()

    // Local State
    const [isPasswordEyeOpen, setIsPasswordEyeOpen] = useState<boolean>(false)
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    // Formik Form Initial Values
    const initialFormValues: RegisterDto = {
        email: "",
        username: "",
        password: ""
    }

    // Formik Form Validation
    const validationSchema: ObjectSchema<RegisterDto> = object().shape({
        email: string().email("Must be a valid E-Mail.").required("E-Mail is required."),
        username: string().min(2, "Please enter a name with at least 2 letters.").max(255, "Please enter a name with maximum 255 letters.").required("Username is required."),
        password: string().min(8, "Please enter a password with at least 8 letters.").max(128, "Please enter a password with maximum 255 letters.").required("Password is required.")
    })

    /**
     * Handle submit register form.
     * @param values input from form
     */
    const onFormSubmit = async ({ username, email, password }: RegisterDto) => {
        setIsLoading(true)

        // Register in our backend
        const registerResponse = await register({
            username,
            email,
            password
        })

        if (registerResponse === null) {
            setIsLoading(false)
            setError("Something went wrong. Try again or come later.")
            return
        }

        if ("statusCode" in registerResponse) {
            if (registerResponse.message.includes("Username")) {
                setError("Username already exists.")
                // TODO: Add logic to show username is already taken
            }
            else if (registerResponse.message.includes("E-Mail")) {
                setError("E-Mail already exists.")
                // TODO: Add logic to show email is already taken
            } else {
                setError(`${registerResponse.statusCode}: ${registerResponse.message}`)
            }

            setIsLoading(false)
            return
        }

        // Register successful -> redirect to callbackUrl
        const callbackUrl = router.asPath.split("?callbackUrl=")[1] ?? routes.home
        router.push(callbackUrl)
    }

    return <>
        <Seo
            title="Register an account"
            description="Register an account on World Wide Weights to start contributing items. It is free and easy. Just fill out the form and you are ready to go."
        />
        {/* Register Form */}
        <Formik initialValues={initialFormValues} validationSchema={validationSchema} onSubmit={onFormSubmit}>
            {({ dirty, isValid }) => (
                <Form className="mb-5 lg:mb-10">
                    {/** Yes, it's username for email. Read: https://web.dev/sign-in-form-best-practices/#autofill */}
                    <TextInput autoComplete="username" type="email" name="email" labelText="E-Mail" placeholder="E-Mail" />
                    <TextInput name="username" labelText="Username" placeholder="Username" />
                    <TextInput autoComplete="new-password" type={isPasswordEyeOpen ? "text" : "password"} name="password" labelText="Password" placeholder="Password" icon={isPasswordEyeOpen ? "visibility" : "visibility_off"} iconOnClick={() => setIsPasswordEyeOpen(!isPasswordEyeOpen)} />

                    <Button loading={isLoading} datacy="register-button" type="submit" icon="login" disabled={!(dirty && isValid)} className="md:mt-8">Register</Button>
                </Form>
            )}
        </Formik>

        {/* TODO (Zoe-Bot): Add correct error handling */}
        {error && <p className="py-2">Error: {error}</p>}

        {/* Login Text */}
        <div className="flex">
            <p className="mr-2">Already have an account?</p>
            <Button to={routes.account.login} kind="tertiary" isColored>Login</Button>
        </div>
    </>
}

// Sets custom account layout
Register.layout = (page: React.ReactElement) => {
    return <AccountLayout
        page={page}
        headline="Create your account"
        description="Start for free."
        sloganHeadline={<><span className="text-blue-300">Weigh</span> something and wanna share it with people?</>}
        sloganDescription="Register to share your stuff." />
}

// Sets guest route (user need to be logged out)
Register.auth = {
    routeType: "guest"
}

export default Register

