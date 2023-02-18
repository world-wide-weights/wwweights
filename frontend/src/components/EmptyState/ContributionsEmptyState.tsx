import { routes } from "../../services/routes/routes"
import { Button } from "../Button/Button"
import { BaseEmptyState } from "./BaseEmptyState"

/**
 * Empty State of Discover Page when no search results.
 */
export const ContributionsEmptyState: React.FC = () => {
    return <BaseEmptyState datacy="contributions-empty-state" icon="volunteer_activism" headline="No contributions">
        <p className="text-center mb-2">You have no contributions yet. Contribute!</p>

        <Button to={routes.contribute.create}>Contribute</Button>
    </BaseEmptyState>
}