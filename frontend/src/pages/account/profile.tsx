import { NextPage } from "next";
import Head from "next/head";
import Image from 'next/image';
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

            <div className="lg:flex gap-4">
                <div className="sm:flex lg:flex-col gap-3 2xl:w-1/4 mb-3 lg:mb-0">
                    <div className="flex flex-col justify-center md:justify-start sm:w-1/2 md:w-auto items-center bg-white rounded-lg py-6 px-4 mb-3 sm:mb-0">
                        <Image src="https://picsum.photos/120" alt="profile picture" width={120} height={120} className="rounded-full mb-2" />
                        <Headline level={3} hasMargin={false}>Zoe</Headline>
                        <p>Member since 19.12.2022</p>
                    </div>
                    <div className="flex flex-col gap-3 flex-grow">
                        <StatsCard icon="visibility" value="300" descriptionTop="Contribution" />
                        <StatsCard icon="visibility" value="300.000.000" descriptionTop="Views" />
                        <StatsCard icon="visibility" value="200" descriptionTop="Feedback" />
                    </div>
                </div>
                <div className="lg:w-3/4">
                    <Headline level={4}>Contributions</Headline>
                    <ul className="mb-5">
                        <ItemPreviewList name="Smartphone" slug="smartphone" weight={{ value: 100, isCa: false }} heaviestWeight={{ value: 200, isCa: false }} imageUrl="https://via.placeholder.com/96.png" />
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