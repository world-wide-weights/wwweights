import { NextPage } from "next";
import Head from "next/head";
import { Headline } from "../../components/Headline/Headline";
import { ItemPreviewList } from "../../components/Item/ItemPreviewList";
import { Pagination } from "../../components/Pagination/Pagination";
import { StatsCard } from "../../components/Statistics/StatsCard";
import { routes } from "../../services/routes/routes";

const Profile: NextPage = () => {
    // TODO: Add user to page title 
    const siteTitle = `Profile - World Wide Weights`

    return <>
        {/* Meta Tags */}
        <Head>
            <title>{siteTitle}</title>
        </Head>

        <main className="container mt-5">
            <Headline level={2}>Profile</Headline>

            <div className="flex gap-4">
                <div className="flex flex-col gap-3 w-1/3">
                    <div className="flex flex-col items-center bg-white rounded-lg py-3 px-4">
                        <Headline level={3} hasMargin={false}>Zoe</Headline>
                        <p>Member since 19.12.2022</p>
                    </div>
                    <StatsCard icon="visibility" value="300" descriptionTop="Contribution" />
                    <StatsCard icon="visibility" value="300" descriptionTop="Contribution" />
                    <StatsCard icon="visibility" value="300" descriptionTop="Contribution" />
                </div>
                <div className="w-2/3">
                    <ul className="mb-5">
                        <ItemPreviewList name="Smartphone" slug="smartphone" weight={{ value: 100, isCa: false }} heaviestWeight={{ value: 100, isCa: false }} imageUrl="https://via.placeholder.com/96.png" />
                        <ItemPreviewList name="Smartphone" slug="smartphone" weight={{ value: 100, isCa: false }} heaviestWeight={{ value: 100, isCa: false }} imageUrl="https://via.placeholder.com/96.png" />
                        <ItemPreviewList name="Smartphone" slug="smartphone" weight={{ value: 100, isCa: false }} heaviestWeight={{ value: 100, isCa: false }} imageUrl="https://via.placeholder.com/96.png" />
                        <ItemPreviewList name="Smartphone" slug="smartphone" weight={{ value: 100, isCa: false }} heaviestWeight={{ value: 100, isCa: false }} imageUrl="https://via.placeholder.com/96.png" />
                    </ul>

                    <Pagination totalItems={10} currentPage={1} baseRoute={routes.account.profile} itemsPerPage={5} />
                </div>
            </div>
        </main>
    </>
}

export default Profile