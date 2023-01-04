import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from 'next/image';
import { Button } from "../../components/Button/Button";
import { LinkWithIconColored } from "../../components/Button/LinkWithIconColored";
import { Headline } from "../../components/Headline/Headline";
import { StatsCard } from "../../components/Statistics/StatsCard";
import { routes } from "../../services/routes/routes";
import { NextPageCustomProps } from "../_app";

/**
 * Login page is a guest route.
 */
const Contribute: NextPageCustomProps = () => {
    const { data: session } = useSession()

    return <>
        {/* Meta Tags */}
        <Head>
            <title>Contribute | WWWeights</title>
            <meta charSet="utf-8" />
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>

        <main className="container mt-5">
            <Headline>Contribute</Headline>

            {/*** Header ***/}
            <div className="bg-white rounded-lg px-8 2xl:px-14 py-4 lg:py-8 mb-3 md:mb-6">
                <div className="flex flex-col md:flex-row items-center">
                    <Image priority src="https://picsum.photos/120" alt="profile picture" width={120} height={120} className="rounded-full mb-2 md:mb-0" />
                    <div className="text-center md:text-left ml-6 mr-4 2xl:mr-20 mb-4 md:mb-0">
                        <Headline level={3} hasMargin={false}>{session?.user.username}</Headline>
                        <Button to={routes.account.profile()} kind="tertiary">View Profile</Button>
                    </div>

                    <div className="grid grid-cols-2 xl:grid-cols-4 gap-8 xl:gap-0 justify-between w-full">
                        <LinkWithIconColored text="Add new Item" icon="add" to={routes.contribute.create} />
                        <LinkWithIconColored text="Suggest changes" icon="edit" to={routes.weights.list()} />
                        {/* TODO (Zoe-Bot): Correct link when exist. */}
                        <LinkWithIconColored text="Give Feedback" icon="comment" to={routes.home} />
                        {/* TODO (Zoe-Bot): Correct link when exist. */}
                        <LinkWithIconColored text="Add photos" icon="image" to={routes.home} />
                    </div>
                </div>
            </div>

            {/*** Stats ***/}
            <Headline level={3} hasMargin={false}>Last 30 days</Headline>
            <p className="mb-4">See your improvements in a time period.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-3 md:mb-6">
                {/* TODO (Zoe-Bot): Implement correct stats card */}
                <StatsCard icon="edit" value="200" descriptionTop="Contributions" />
                <StatsCard icon="visibility" value="3.000.000" descriptionTop="Views" />
                <StatsCard icon="comment" value="200" descriptionTop="Feedback" />
            </div>
        </main>
    </>
}

// Sets route need to be logged in
// Contribute.auth = {
//     routeType: "protected"
// }

export default Contribute

