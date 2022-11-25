import { Button } from "../Button/Button"
import { Headline } from "../Headline/Headline"

type BaseErrorProps = {
    /** The title of the page */
    headline: string
    /** Custom descripton for example can be just a little text for more information or a list with the reasons. */
    description: React.ReactNode
    /** Custom url for back button */
    to?: string
    /** Custom text for back button */
    buttonText?: string
}

/**
 * Base Error Component, is used as a wrapper for errors like 404, 500,...
 */
export const BaseError: React.FC<BaseErrorProps> = ({ headline, description, to = "/", buttonText = "Back home" }) => {
    return <div className="container mt-10 md:mt-40">
        <div className="md:w-2/3">
            <Headline>{headline}</Headline>
            {description}
            <Button className="mt-5" to={to} icon="arrow_back">{buttonText}</Button>
        </div>
    </div>
}