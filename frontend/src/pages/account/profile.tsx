import { useSession } from "next-auth/react"
import Image from "next/image"
import { Card } from "../../components/Card/Card"
import { Headline } from "../../components/Headline/Headline"
import { ItemListContribute } from "../../components/Item/ItemListContribute"
import { Seo } from "../../components/Seo/Seo"
import { NextPageCustomProps } from "../_app"

/**
 * Profile page
 */
const Profile: NextPageCustomProps = () => {
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
                        <ItemListContribute name="Smartphone difjisdjfitrzrtzrzsjfidfdsfsdfsdfsdfsdfdfsdfsd" slug="smartphone" weight={{ value: 10, additionalValue: 20, isCa: true }} image="https://via.placeholder.com/96.png" />
                        <ItemListContribute name="Smartphonsdfdsfsdfe" slug="smartphone" weight={{ value: 95, isCa: true }} />
                        <ItemListContribute name="Smartphonsdfsdfsfd  sdfjsoidfe dsfjsdoifjöä" slug="smartphone" weight={{ value: 1000, additionalValue: 100000 }} image="https://via.placeholder.com/96.png" />
                        <ItemListContribute name="fdsdf" slug="smartphone" weight={{ value: 95, additionalValue: 145, isCa: true }} image="https://via.placeholder.com/96.png" />
                        <ItemListContribute name="Smartphone" slug="smartphone" weight={{ value: 4382949328 }} image="https://via.placeholder.com/96.png" />
                    </ul>

                    {/* TODO (Zoe-Bot): Implement correct pagination */}
                    {/* <Pagination totalItems={10} currentPage={1} baseRoute={routes.account.profile} itemsPerPage={5} /> */}
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