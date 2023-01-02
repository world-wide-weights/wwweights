import { Headline } from "../../components/Headline/Headline";
import { NextPageCustomProps } from "../_app";

const Profile: NextPageCustomProps = () => {
    return <div className="container">
        <Headline level={2}>Profile</Headline>
    </div>
}

Profile.auth = true

export default Profile