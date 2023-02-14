import { isAxiosError } from "axios"
import Image from "next/image"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../components/Auth/Auth"
import { Card } from "../../components/Card/Card"
import { ContributionsEmptyState } from "../../components/EmptyState/ContributionsEmptyState"
import { Headline } from "../../components/Headline/Headline"
import { ItemListContribute } from "../../components/Item/ItemListContribute"
import { SkeletonLoadingProfile } from "../../components/Loading/SkeletonLoadingProfile"
import { Pagination } from "../../components/Pagination/Pagination"
import { Seo } from "../../components/Seo/Seo"
import { authRequest, queryRequest } from "../../services/axios/axios"
import { routes } from "../../services/routes/routes"
import { Profile } from "../../types/auth"
import { Item, PaginatedResponse } from "../../types/item"
import Custom500 from "../500"
import { NextPageCustomProps } from "../_app"

type Statistics = {
    totalContributions: number
    itemsCreated: number
    itemsUpdated: number
    itemsDeleted: number
}

/**
 * Profile page, shows user profile statistics and contributions.
 */
const Profile: NextPageCustomProps = () => {
    // Local States
    const [profile, setProfile] = useState<Profile | undefined>()
    const [contributions, setContributions] = useState<PaginatedResponse<Item>>({ data: [], total: 0, page: 1, limit: 10 })
    const [statistics, setStatistics] = useState<Statistics>({ totalContributions: 0, itemsCreated: 0, itemsUpdated: 0, itemsDeleted: 0 })
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | undefined>(undefined)

    // Global States
    const { getSession } = useContext(AuthContext)

    // Local variables
    const isLoadingProfile = !profile || isLoading

    // Fetch profile data
    useEffect(() => {
        setIsLoading(true)

        const fetchProfile = async () => {
            const sessionData = await getSession()
            if (!sessionData) return

            try {
                // Fetch contributions, statistics and profile
                const [contributionsResponse, statisticsResponse, profileResponse] = await Promise.all([
                    queryRequest.get<PaginatedResponse<Item>>(`/items/list?userid=${sessionData.decodedAccessToken.id}`),
                    queryRequest.get<StatisticsResponse>(`/profiles/${sessionData.decodedAccessToken.id}/statistics`),
                    authRequest.get<Profile>("/profile/me", {
                        headers: {
                            "Authorization": `Bearer ${sessionData.accessToken}`
                        }
                    })
                ])

                // Prepare statistics
                const itemsCreated = statisticsResponse.data.count?.itemsCreated ?? 0
                const itemsUpdated = statisticsResponse.data.count?.itemsUpdated ?? 0
                const itemsDeleted = statisticsResponse.data.count?.itemsDeleted ?? 0
                const totalContributions = itemsCreated + itemsUpdated + itemsDeleted
                const statistics = {
                    totalContributions,
                    itemsCreated,
                    itemsUpdated,
                    itemsDeleted
                }

                setProfile(profileResponse.data)
                setContributions(contributionsResponse.data)
                setStatistics(statistics)
            } catch (error) {
                isAxiosError(error) && error.response ? setError(error.response.data.message) : setError("Netzwerk-Zeitüberschreitung")
                console.error(error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchProfile()
    }, [getSession])

    if (error)
        return <Custom500 />

    if (isLoadingProfile)
        return <SkeletonLoadingProfile />

    return <>
        <Seo
            title="My Profile"
            description="Your profile page. Here you can see your contributions and statistics."
        />

        <main className="container mt-5">
            <Headline level={1}>Profile</Headline>
            <div className="lg:flex gap-4">
                <div className="sm:flex lg:flex-col gap-3 2xl:w-1/4 mb-6 lg:mb-0">
                    {/* Meta infos */}
                    <div className="flex flex-col justify-center md:justify-start sm:w-1/2 md:w-auto items-center bg-white rounded-lg py-6 px-4 mb-3 sm:mb-0">
                        <Image src="https://picsum.photos/120" alt="profile picture" width={120} height={120} className="rounded-full mb-2" />
                        <Headline level={3} hasMargin={false}>{profile.username}</Headline>
                        <p><>Member since {new Date(profile.createdAt).toLocaleDateString("en-US")}</></p>
                    </div>

                    {/* Statistics */}
                    <div className="flex flex-col gap-3 flex-grow">
                        <Card icon="volunteer_activism" value={statistics.totalContributions.toLocaleString("en-US")} descriptionTop="Contributions" />
                        <Card icon="weight" value={statistics.itemsCreated.toLocaleString("en-US")} descriptionTop="Items created" />
                        <Card icon="edit" value={statistics.itemsUpdated.toLocaleString("en-US")} descriptionTop="Items updated" />
                        <Card icon="close" value={statistics.itemsDeleted.toLocaleString("en-US")} descriptionTop="Items deleted" />
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
        </main>
    </>
}

// Sets route need to be logged in
Profile.auth = {
    routeType: "protected"
}

export default Profile