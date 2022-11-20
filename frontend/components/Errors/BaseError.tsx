import { Button } from "../Button/Button"
import { Headline } from "../Headline/Headline"

type BaseErrorProps = {
    headline: string
    description: React.ReactNode
}

export const BaseError: React.FC<BaseErrorProps> = ({ headline, description }) => {
    return <div className="container mt-10 md:mt-40">
        <div className="md:w-2/3">
            <Headline>{headline}</Headline>
            {description}
            <Button className="mt-5" to="/" icon="arrow_back">Zurück zu Startseite</Button>
        </div>
    </div>
}