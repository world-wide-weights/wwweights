import { Form, Formik } from "formik"
import { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { getServerSession } from "next-auth"
import Head from "next/head"
import { useRouter } from "next/router"
import { Button } from "../components/Button/Button"
import { Footer } from "../components/Footer/Footer"
import { ItemPreviewGrid } from "../components/Item/ItemPreviewGrid"
import { Navbar } from "../components/Navbar/Navbar"
import { Search } from "../components/Search/Search"
import { Stat } from "../components/Statistics/Stat"
import { queryRequest } from "../services/axios/axios"
import { routes } from "../services/routes/routes"
import { Item, PaginatedResponse } from "../types/item"
import { authOptions } from "./api/auth/[...nextauth]"

type HomeProps = {
	items: Item[]
}

/**
 * Landing Page.
 */
function Home({ items }: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const router = useRouter()

	// Formik Initial Values
	const initialQueryValues = {
		query: ""
	}

	/**
	 * Formik function calls when form is submitted.
	 * Will redirect to items list with the given query 
	 * @param formValues 
	 */
	const submitForm = (formValues: typeof initialQueryValues) => {
		router.push(routes.weights.list({ query: formValues.query }))
	}

	return (
		<div>
			<Head>
				<title>World largest database of weights! | World Wide Weights</title>
				<meta charSet="utf-8" />
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>

			<header className="bg-background-header-index bg-no-repeat bg-cover bg-center md:border-t-4 md:border-blue-500">
				{/* Navbar */}
				<Navbar />

				{/* Header */}
				<div className="container flex flex-col items-center justify-center py-10 md:min-h-[30rem]">
					<h1 className="text-white text-2xl md:text-4xl font-bold mb-1">How much weighs?</h1>
					<p className="text-gray-200 mb-3 md:mb-6">World largest database of weights!</p>

					{/* Search */}
					{/* TODO (Zoe-bot): Move formik stuff to search component */}
					<Formik initialValues={initialQueryValues} onSubmit={submitForm}>
						<Form className="flex justify-center w-full">
							<div className="w-full md:w-[30rem]">
								<Search />
							</div>
						</Form>
					</Formik>
				</div>
			</header>

			<main className="bg-gray-100 pt-5 md:pt-10">
				{/* Items */}
				<div className="container flex flex-col items-center mb-5 md:mb-10">
					<h2 className="text-2xl md:text-3xl text-blue-800 text-center font-bold mb-1">Explore 31,000+ weights</h2>
					<p className="text-gray-600 text-center mb-4 md:mb-8">World Wide weights is a website where you can discover the weights of all the items you can imagine. Explore the largest database of weights!</p>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 md:gap-5 mb-5 md:mb-8 w-full">
						{items.map((item) => <ItemPreviewGrid key={item.slug} {...item} imageUrl={item.image} />)}
					</div>

					<Button className="mb-2" to={routes.weights.list()} icon="weight">Show all weights</Button>
				</div>

				{/* Stats */}
				<div className="bg-blue-200 py-6">
					<div className="container flex flex-col md:flex-row gap-5 justify-around">
						<Stat icon="weight" value="31.000+" description="Weights" />
						<Stat icon="person" value="300+" description="Users" />
						<Stat icon="chat_bubble" value="10.000+" description="Contributions" />
					</div>
				</div>

				{/* Search */}
				<div className="bg-blue-900 py-10">
					<div className="container flex flex-col items-center">
						<h1 className="text-white text-3xl md:text-4xl text-center font-bold mb-1">Search for over <span className="text-blue-300">31,000+ weights</span></h1>
						<p className="text-gray-200 text-center mb-3 md:mb-6">World largest database of weights!</p>

						<Formik initialValues={initialQueryValues} onSubmit={submitForm}>
							<Form className="flex justify-center w-full">
								<div className="w-full md:w-[30rem]">
									<Search />
								</div>
							</Form>
						</Formik>
					</div>
				</div>
			</main>

			{/* Footer */}
			<Footer />
		</div>
	)
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async (context) => {
	const [response, session] = await Promise.all([
		queryRequest.get<PaginatedResponse<Item>>("/items/list?page=1&limit=20&query=iphone 2020"),
		getServerSession(context.req, context.res, authOptions)
	])
	const items = response.data.data

	return {
		props: {
			items,
			session
		}
	}
}

Home.getLayout = (page: React.ReactElement) => {
	return <>{page}</>
}

export default Home
