import Head from "next/head";
import { Button } from "../components/Button/Button";
import { Stats } from "../components/Statistics/Stats";
import { routes } from "../services/routes/routes";

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
        <Button to={routes.weights.list()} icon="list">Weights List</Button>
        <Stats />
      </div>
    </div>
  )
}

export default Home
