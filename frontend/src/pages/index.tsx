import { Form, Formik } from "formik";
import Head from "next/head";
import { Button } from "../components/Button/Button";
import { Search } from "../components/Form/Search/Search";
import { routes } from "../services/routes/routes";

const initialValues = {
  search: ""
}

const submitForm = (values: typeof initialValues) => {
  console.log(values);
}


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
        <Formik initialValues={initialValues} onSubmit={submitForm}>
          <Form>
            <div className="w-80">
              <Search to={"/"} />
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  )
}

export default Home
