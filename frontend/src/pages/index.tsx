import { Form, Formik } from "formik"
import { GetServerSideProps, InferGetServerSidePropsType } from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import { Button } from "../components/Button/Button"
import { Footer } from "../components/Footer/Footer"
import { ItemPreviewGrid } from "../components/Item/ItemPreviewGrid"
import { Navbar } from "../components/Navbar/Navbar"
import { Search } from "../components/Search/Search"
import { Seo } from "../components/Seo/Seo"
import { Stat } from "../components/Statistics/Stat"
import { authRequest, queryServerRequest } from "../services/axios/axios"
import { routes } from "../services/routes/routes"
import { getStructuredDataWebsite } from "../services/seo/structuredData/website"
import { getImageUrl } from "../services/utils/getImageUrl"
import { Item } from "../types/item"
import { PaginatedResponse } from "../types/paginated"

type HomeProps = {
	items: Item[]
	statistics: {
		totalUsers: number
		totalItems: number
		totalContributions: number
	}
}

/**
 * Landing Page.
 */
function Home({ items, statistics }: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const router = useRouter()
	const totalItems = statistics.totalItems.toLocaleString("en-US", { maximumFractionDigits: 0 })
	const totalUsers = statistics.totalUsers.toLocaleString("en-US", { maximumFractionDigits: 0 })
	const totalContributions = statistics.totalContributions.toLocaleString("en-US", { maximumFractionDigits: 0 })

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
			<Seo
				title="World's largest database of weights!"
				description="World Wide Weights is a website where you can discover the weights of all the items you can imagine. Explore the largest database of weights!"
			/>
			{/** Website Structured data has to be on / page. Only once. */}
			<Head>
				<script
					type="application/ld+json"
					/** We have to use "dangerouslySetInnerHTML" here to make it easier to write JSON-LD  */
					dangerouslySetInnerHTML={getStructuredDataWebsite}
					key="websiteLdJson"
				/>
			</Head>

			<header className="bg-background-header-index bg-no-repeat bg-cover bg-center md:border-t-4 md:border-blue-500">
				{/* Navbar */}
				<Navbar />

				{/* Header */}
				<div className="container flex flex-col items-center justify-center pt-10 pb-8 md:pt-20 md:pb-16">
					<h1 className="text-white text-2xl md:text-4xl font-bold mb-1">How much weighs?</h1>
					<p className="text-gray-200 mb-3 md:mb-6">World&apos;s largest database of weights!</p>

					{/* Search */}
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
					<h2 className="text-2xl md:text-3xl text-blue-800 text-center font-bold mb-1">Explore {totalItems}+ weights</h2>
					<p className="text-gray-600 text-center mb-4 md:mb-8">World Wide Weights is a website where you can discover the weights of all the items you can imagine. Explore the largest database of weights!</p>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 md:gap-5 mb-5 md:mb-8 w-full">
						{items.map((item) => <ItemPreviewGrid key={item.slug} {...item} imageUrl={getImageUrl(item.image)} />)}
					</div>

					<Button className="mb-2" to={routes.weights.list()} icon="weight">Show all weights</Button>
				</div>

				{/* Stats */}
				<div className="bg-blue-200 py-6">
					<div className="container flex flex-col md:flex-row gap-5 justify-around">
						<Stat icon="weight" value={`${totalItems}+`} description="Weights" />
						<Stat icon="person" value={`${totalUsers}+`} description="Contributers" />
						<Stat icon="chat_bubble" value={`${totalContributions}+`} description="Contributions" />
					</div>
				</div>

				{/* Search */}
				<div className="bg-blue-900 py-10">
					<div className="container flex flex-col items-center">
						<h1 className="text-white text-3xl md:text-4xl text-center font-bold mb-1">Search for over <span className="text-blue-300">{totalItems}+ weights</span></h1>
						<p className="text-gray-200 text-center mb-3 md:mb-6">World&apos;s database of weights!</p>

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

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
	try {
		const [itemsResponse, statisticsUser, statisticsTotal] = await Promise.all([
			queryServerRequest.get<PaginatedResponse<Item>>("/items/list?page=1&limit=20"),
			authRequest.get<{ totalUsers: number }>("/auth/statistics"),
			queryServerRequest.get<{ totalItems: 0, totalContributions: 0 }>("/statistics")
		])

		const items = itemsResponse.data.data
		const statistics = {
			totalUsers: statisticsUser.data.totalUsers ?? 0,
			totalItems: statisticsTotal.data.totalItems ?? 0,
			totalContributions: statisticsTotal.data.totalContributions ?? 0
		}

		return {
			props: {
				items,
				statistics
			}
		}
	} catch (error) {
		// axios.isAxiosError(error) && error.response ? setError(error.response.data.message) : setError("Netzwerk-Zeitüberschreitung")
		console.error(error)
		return {
			props: {
				items: [],
				statistics: {
					totalUsers: 0,
					totalItems: 0,
					totalContributions: 0
				}
			}
		}
	}
}

Home.layout = (page: React.ReactElement) => {
	return <>{page}</>
}

export default Home
