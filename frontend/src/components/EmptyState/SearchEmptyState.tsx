import { routes } from "../../services/routes/routes"
import { Button } from "../Button/Button"
import { BaseEmptyState } from "./BaseEmptyState"

type SearchEmptyStateProps = {
    /** Search query to display in headline and in text. */
    query: string
}

/**
 * Empty State of Discover Page when no search results.
 */
export const SearchEmptyState: React.FC<SearchEmptyStateProps> = ({ query }) => {
    return <BaseEmptyState headline={`No results for "${query}"`}>
        <p className="text-center">Do you know what &quot;{query}&quot; weights? Contribute!</p>
        <p className="text-center mb-5">Or try search again.</p>

        {/* TODO (Zoe-Bot): Adjust link when contribute implemented. */}
        <Button to="/contribute" className="mb-3">Contribute</Button>
        <Button to={routes.weights.list({ query: "" })} kind="tertiary">Try again</Button>
    </BaseEmptyState>
}