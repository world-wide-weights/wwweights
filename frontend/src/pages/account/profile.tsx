import { GetServerSideProps, InferGetServerSidePropsType } from "next"
import Image from "next/image"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../components/Auth/Auth"
import { Card } from "../../components/Card/Card"
import { ContributionsEmptyState } from "../../components/EmptyState/ContributionsEmptyState"
import { Headline } from "../../components/Headline/Headline"
import { ItemListContribute } from "../../components/Item/ItemListContribute"
import { Pagination } from "../../components/Pagination/Pagination"
import { Seo } from "../../components/Seo/Seo"
import { authRequest, queryRequest } from "../../services/axios/axios"
import { routes } from "../../services/routes/routes"
import { Profile } from "../../types/auth"
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

function Profile({ contributions, statistics }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    // Local States
    const [profile, setProfile] = useState<Profile | undefined>()

    // Global States
    const { getSession, isLoading } = useContext(AuthContext)

    useEffect(() => {
        const fetchProfile = async () => {
            const sessionData = await getSession()
            if (!sessionData) return
            const response = await authRequest.get<Profile>("/profile/me", {
                headers: {
                    "Authorization": `Bearer ${sessionData.accessToken}`
                }
            })
            setProfile(response.data)
        }
        fetchProfile()
    }, [getSession])

    const isLoadingProfile = !profile || isLoading

    return <>
        <Seo
            title="My Profile"
            description="Your profile page. Here you can see your contributions and statistics."
        />

        {isLoadingProfile && <main className="container mt-5">
            <p>Loading...</p>
        </main>}

        {!isLoadingProfile && <main className="container mt-5">
            <Headline level={1}>Profile</Headline>
            <div className="lg:flex gap-4">
                <div className="sm:flex lg:flex-col gap-3 2xl:w-1/4 mb-6 lg:mb-0">
                    {/* Meta infos */}
                    <div className="flex flex-col justify-center md:justify-start sm:w-1/2 md:w-auto items-center bg-white rounded-lg py-6 px-4 mb-3 sm:mb-0">
                        <Image src="https://picsum.photos/120" alt="profile picture" width={120} height={120} className="rounded-full mb-2" />
                        <Headline level={3} hasMargin={false}>{profile.username}</Headline>
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
                    {contributions.data.length === 0 ? <ContributionsEmptyState /> :
                        <>
                            <Headline level={4}>Contributions</Headline>
                            <ul className="mb-5">
                                {contributions.data.map((contribution) => <ItemListContribute {...contribution} key={contribution.slug} />)}
                            </ul>
                            <Pagination totalItems={contributions.total} currentPage={contributions.page} baseRoute={routes.account.profile} itemsPerPage={contributions.limit} />
                        </>}
                </div>
            </div>
        </main>}
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