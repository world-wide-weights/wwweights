import type { AppProps } from 'next/app'
import { Layout } from '../components/Layout/Layout'
import '../styles/global.css'

const App = ({ Component, pageProps }: AppProps) => {
  return <Layout>
    <Component {...pageProps} />
  </Layout>
}

export default App
