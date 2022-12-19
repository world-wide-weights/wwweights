import { Form, Formik } from "formik";
import Head from "next/head";
import { Button } from "../components/Button/Button";
import { Dropdown } from "../components/Form/Dropdown/Dropdown";
import { routes } from "../services/routes/routes";

const initialValues = {
  filter: ""
}

const submitForm = (values: typeof initialValues) => {
  console.log(values);
}

const data = {
  name: "filter",
  placeholder: "Choose a filter...",
  options: [
    {
      id: 1,
      label: "Relevance"
    },
    {
      id: 2,
      label: "Das ist ein sehr langer Text für ein Dropdown item",
      icon: "face"
    },
    {
      id: 3,
      label: "Lightest",
      icon: "face"
    }
  ]
}

const Home = () => {
  return (
    <div>
      <Head>
        <title>WWWeights | Development</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <div className="container">
        <p>Hello World</p>
        <Button className="mt-2" to={routes.weights.list()} icon="list">Weights List</Button>
        <Button className="mt-2" to={routes.tags.list()} icon="bookmark">Tags List</Button>

        <Formik initialValues={initialValues} onSubmit={submitForm}>
          <Form>
            <div className="w-80">
              <Dropdown name={data.name} options={data.options} placeholder={data.placeholder} />
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  )
}

export default Home
