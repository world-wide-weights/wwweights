import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from 'next/image';
import { Headline } from "../../components/Headline/Headline";
import { ItemPreviewList } from "../../components/Item/ItemPreviewList";
import { StatsCard } from "../../components/Statistics/StatsCard";
import { NextPageCustomProps } from "../_app";

const Profile: NextPageCustomProps = () => {
    const { data: session } = useSession()
    const siteTitle = `Profile ${session?.user.username} - World Wide Weights`

    return <>
        {/* Meta Tags */}
        <Head>
            <title>{siteTitle}</title>
            <meta charSet="utf-8" />
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>

        <main className="container mt-5">
            <Headline level={1}>Profile</Headline>

            <div className="lg:flex gap-4">
                <div className="sm:flex lg:flex-col gap-3 2xl:w-1/4 mb-4 lg:mb-0">
                    <div className="flex flex-col justify-center md:justify-start sm:w-1/2 md:w-auto items-center bg-white rounded-lg py-6 px-4 mb-3 sm:mb-0">
                        <Image src="https://picsum.photos/120" alt="profile picture" width={120} height={120} className="rounded-full mb-2" />
                        <Headline level={3} hasMargin={false}>{session?.user.username}</Headline>
                        {/* TODO (Zoe-Bot): Update date */}
                        <p>Member since 19.12.2022</p>
                    </div>
                    <div className="flex flex-col gap-3 flex-grow">
                        {/* TODO (Zoe-Bot): Implement correct stats */}
                        <StatsCard icon="volunteer_activism" value="300" descriptionTop="Contribution" />
                        <StatsCard icon="visibility" value="300.000.000" descriptionTop="Views" />
                        <StatsCard icon="chat" value="200" descriptionTop="Feedback" />
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

                    {/* TODO: Implement correct pagination */}
                    {/* <Pagination totalItems={10} currentPage={1} baseRoute={routes.account.profile} itemsPerPage={5} /> */}
                </div>
            </div>
        </main>
    </>
}

Profile.auth = {
    routeType: "protected"
}

export default Profile