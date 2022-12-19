import Head from "next/head";
import { Button } from "../components/Button/Button";
import { ItemPreviewList } from "../components/Item/ItemPreviewList";
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
        <Button className="mt-2" to={routes.weights.list()} icon="list">Weights List</Button>
        <Button className="mt-2" to={routes.tags.list()} icon="bookmark">Tags List</Button>

        <ul>
          <ItemPreviewList name="Smartphone Tessdjfdskfjskjdfk" slug="smartphone" weight={{ value: 200, isCa: false }} imageUrl="https://via.placeholder.com/96.png" />
          <ItemPreviewList name="Smartphone" slug="smartphone" weight={{ value: 200, aditionalValue: 300, isCa: false }} imageUrl="https://via.placeholder.com/96.png" />
          <ItemPreviewList name="Smartphone" slug="smartphone" weight={{ value: 200, isCa: false }} />
          <ItemPreviewList name="Smartphone" slug="smartphone" weight={{ value: 200, isCa: false }} imageUrl="https://via.placeholder.com/96.png" />
        </ul>
      </div>
    </div>
  )
}

export default Home
