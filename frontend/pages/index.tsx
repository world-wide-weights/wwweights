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

      <div className="container mx-auto px-5">
        <Button kind="primary" disabled icon="face">Primary onclick loading</Button>
        <Button kind="secondary" icon="face" disabled>Secondary onclick loading</Button>
        <Button kind="tertiary" icon="face" loading>Tertiary onclick loading</Button>

        <Button to="/" kind="primary" icon="face" loading>Primary link loading</Button>
        <Button to="/" kind="secondary" icon="face" loading>Secondary link loading</Button>
        <Button to="/" kind="tertiary" icon="face" loading>Tertiary link loading</Button>

        <Button onClick={() => console.log("test")} kind="primary" icon="face">Primary onClick</Button>
        <Button kind="secondary" icon="face">Secondary onClick</Button>
        <Button kind="tertiary" icon="face">Tertiary onClick</Button>

        <Button to="/" kind="primary" icon="face">Primary link</Button>
        <Button to="/" kind="secondary" icon="face">secondary link</Button>
        <Button to="/" kind="tertiary" icon="face">tertiary link</Button>
      </div>
    </div>
  )
}

export default Home
