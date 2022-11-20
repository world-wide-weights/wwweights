import { Montserrat } from '@next/font/google';
import 'material-symbols';
import type { AppProps } from 'next/app';
import { Layout } from '../components/Layout/Layout';
import '../styles/global.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
})

const App = ({ Component, pageProps }: AppProps) => {
  return <main className={`${montserrat.variable} font-sans`}>
    <Layout>
      <Component {...pageProps} />
    </Layout>
  </main>
}

export default App
