import { Form, Formik } from "formik";
import Head from "next/head";
import * as yup from 'yup';
import { Button } from "../components/Button/Button";
import { TextInput } from "../components/Form/Input/Input";
import { routes } from "../services/routes/routes";

const initialValues = {
  title: ""
}

const submitForm = (values: typeof initialValues) => {
  console.log(values);
}

const schema = yup.object().shape({
  title: yup.string().max(20).required("Title is required"),
})

const Home = () => {
  return (
    <div>
      <Head>
        <title>WWWeights | Development</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <div className="container bg-white">
        <p>Hello World</p>
        <Button to={routes.weights.list()} icon="list">Weights List</Button>

        <Formik initialValues={initialValues} onSubmit={submitForm} validationSchema={schema} >
          {(formik) => (
            <Form>
              <div className="w-80">
                <TextInput type="search" name="title" icon="search" placeholder="test" helperText="test sjdfkjsdfkskdfjskldfjksdfklsjdfsdklfjklsf lsdlkfjsdfj jflsjdfjsdf" />
              </div>
            </Form>
          )}
        </Formik>
      </div>


    </div>
  )
}

export default Home
