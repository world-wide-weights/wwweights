import Image from "next/image"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../components/Auth/Auth"
import { Card } from "../../components/Card/Card"
import { Headline } from "../../components/Headline/Headline"
import { ItemPreviewList } from "../../components/Item/ItemPreviewList"
import { Seo } from "../../components/Seo/Seo"
import { SessionData } from "../../types/auth"
import { NextPageCustomProps } from "../_app"

const Profile: NextPageCustomProps = () => {
    // Local States
    const [session, setSession] = useState<SessionData>()

    // Global States
    const { getSession, isLoading } = useContext(AuthContext)

    useEffect(() => {
        const fetchProfile = async () => {
            const sessionData = await getSession()
            if (!sessionData) return
            setSession(sessionData)

            // const response = await authRequest.get("/profile/me", {
            //     headers: {
            //         "Authorization": `Bearer ${sessionData.accessToken}`
            //     }
            // })
            // const data = response.data
            // setProfile(data)
        }
        fetchProfile()
    }, [getSession])

    return <>
        <Seo
            title="My Profile"
            description="Your profile page. Here you can see your contributions and statistics."
        />

        {isLoading && <main className="container mt-5">
            <p>Loading...</p>
        </main>}

        {!isLoading && <main className="container mt-5">
            <Headline level={1}>Profile</Headline>
            <div className="lg:flex gap-4">
                <div className="sm:flex lg:flex-col gap-3 2xl:w-1/4 mb-4 lg:mb-0">
                    <div className="flex flex-col justify-center md:justify-start sm:w-1/2 md:w-auto items-center bg-white rounded-lg py-6 px-4 mb-3 sm:mb-0">
                        <Image src="https://picsum.photos/120" alt="profile picture" width={120} height={120} className="rounded-full mb-2" />
                        <Headline level={3} hasMargin={false}>{session?.decodedAccessToken.username}</Headline>
                        {/* TODO (Zoe-Bot): Update date */}
                        <p>Member since 19.12.2022</p>
                    </div>
                    <div className="flex flex-col gap-3 flex-grow">
                        {/* TODO (Zoe-Bot): Implement correct stats */}
                        <Card icon="volunteer_activism" value="300" descriptionTop="Contribution" />
                        <Card icon="visibility" value="300.000.000" descriptionTop="Views" />
                        <Card icon="chat" value="200" descriptionTop="Feedback" />
                    </div>
                </div>
                <div className="lg:w-3/4">
                    <Headline level={4}>Contributions</Headline>
                    {/* TODO (Zoe-Bot): Implement correct contributions */}
                    {/* TODO (Zoe-Bot): Implement EmptyState */}
                    <ul className="mb-5">
                        <ItemPreviewList name="Smartphone" slug="smartphone" weight={{ value: 95, additionalValue: 145, isCa: true }} heaviestWeight={{ value: 300, isCa: false }} imageUrl="https://via.placeholder.com/96.png" />
                        <ItemPreviewList name="Smartphone" slug="smartphone" weight={{ value: 99, isCa: false }} heaviestWeight={{ value: 300, isCa: false }} imageUrl="https://via.placeholder.com/96.png" />
                        <ItemPreviewList name="Smartphone" slug="smartphone" weight={{ value: 150, isCa: true }} heaviestWeight={{ value: 300, isCa: false }} imageUrl="https://via.placeholder.com/96.png" />
                        <ItemPreviewList name="Smartphone" slug="smartphone" weight={{ value: 300, isCa: false }} heaviestWeight={{ value: 300, isCa: false }} imageUrl="https://via.placeholder.com/96.png" />
                    </ul>

                    {/* TODO (Zoe-Bot): Implement correct pagination */}
                    {/* <Pagination totalItems={10} currentPage={1} baseRoute={routes.account.profile} itemsPerPage={5} /> */}
                </div>
            </div>
        </main>}
    </>
}

// Sets route need to be logged in
Profile.auth = {
    routeType: "protected"
}

export default Profile