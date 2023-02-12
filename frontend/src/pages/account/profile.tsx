import { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { Card } from "../../components/Card/Card"
import { Headline } from "../../components/Headline/Headline"
import { ItemListContribute } from "../../components/Item/ItemListContribute"
import { Seo } from "../../components/Seo/Seo"
import { queryRequest } from "../../services/axios/axios"
import { Item, PaginatedResponse } from "../../types/item"

type ProfilePageProps = {
    contributions: PaginatedResponse<Item>
    statistics: {
        totalContributions: number
        itemsCreated: number
        itemsUpdated: number
        itemsDeleted: number
    }
}

/**
 * Profile page
 */
function Profile({ contributions, statistics }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const { data: session } = useSession()
    const seoTitle = `My Profile ${session?.user.username}`

    return <>
        <Seo title={seoTitle} description="Your profile page. Here you can see your contributions and statistics." />

        <main className="container mt-5">
            {/* Headline */}
            <Headline level={1}>Profile</Headline>

            {/* Meta infos and Statistics */}
            <div className="lg:flex gap-4">
                <div className="sm:flex lg:flex-col gap-3 2xl:w-1/4 mb-6 lg:mb-0">
                    {/* Meta infos */}
                    <div className="flex flex-col justify-center md:justify-start sm:w-1/2 md:w-auto items-center bg-white rounded-lg py-6 px-4 mb-3 sm:mb-0">
                        <Image src="https://picsum.photos/120" alt="profile picture" width={120} height={120} className="rounded-full mb-2" />
                        <Headline level={3} hasMargin={false}>{session?.user.username}</Headline>
                        {/* TODO (Zoe-Bot): Update date */}
                        <p>Member since 19.12.2022</p>
                    </div>

                    {/* Statistics */}
                    <div className="flex flex-col gap-3 flex-grow">
                        {/* TODO (Zoe-Bot): Implement correct stats */}
                        <Card icon="volunteer_activism" value="300" descriptionTop="Contribution" />
                        <Card icon="visibility" value="300.000.000" descriptionTop="Views" />
                        <Card icon="chat" value="200" descriptionTop="Feedback" />
                    </div>
                </div>

                {/* Contributions */}
                <div className="lg:w-3/4">
                    <Headline level={4}>Contributions</Headline>
                    {/* TODO (Zoe-Bot): Implement correct contributions */}
                    {/* TODO (Zoe-Bot): Implement EmptyState */}
                    <ul className="mb-5">
                        {contributions.data.length === 0 ? <p>No contributions yet</p> : contributions.data.map((contribution) => (
                            <ItemListContribute {...contribution} key={contribution.slug} />
                        ))}
                    </ul>
                    {/* TODO (Zoe-Bot): Implement correct pagination */}
                    {/* <Pagination totalItems={10} currentPage={1} baseRoute={routes.account.profile} itemsPerPage={5} /> */}
                </div>
            </div>
        </main>
    </>
}

export const getServerSideProps: GetServerSideProps<ProfilePageProps> = async () => {
    try {
        // Fetch contributions and statistics
        // TODO (Zoe-Bot): Implement update user id
        const [contributionsResponse, statisticsResponse] = await Promise.all([
            queryRequest.get<PaginatedResponse<Item>>("/items/list?userid=1"),
            queryRequest.get<StatisticsResponse>("/profiles/1/statistics"),
        ])

        // Prepare contributions and statistics
        const contributions = contributionsResponse.data
        const itemsCreated = statisticsResponse.data.count.itemsCreated ?? 0
        const itemsUpdated = statisticsResponse.data.count.itemsUpdated ?? 0
        const itemsDeleted = statisticsResponse.data.count.itemsDeleted ?? 0
        const totalContributions = itemsCreated + itemsUpdated + itemsDeleted
        const statistics = {
            totalContributions,
            itemsCreated,
            itemsUpdated,
            itemsDeleted,
        }

        return {
            props: {
                contributions,
                statistics
            }
        }
    } catch (error) {
        // axios.isAxiosError(error) && error.response ? setError(error.response.data.message) : setError("Netzwerk-Zeitüberschreitung")
        console.error(error)
        return {
            props: {
                contributions: {
                    total: 0,
                    page: 1,
                    limit: 0,
                    data: [],
                },
                statistics: {
                    totalContributions: 0,
                    itemsCreated: 0,
                    itemsUpdated: 0,
                    itemsDeleted: 0
                }
            }
        }
    }
}

// Sets route need to be logged in
Profile.auth = {
    routeType: "protected"
}

export default Profile