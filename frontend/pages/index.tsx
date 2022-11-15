import Head from "next/head";
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
        <Button to="/weights" icon="list">Weights List</Button>
      </div>
    </div>
  )
}

export default Home
