import Head from "next/head";
import { routes } from "../services/routes/routes";
import { Button } from "../components/Button/Button";

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
      </div>
    </div>
  )
}

export default Home
