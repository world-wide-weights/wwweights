import { routes } from "../../services/routes/routes"
import { Button } from "../Button/Button"
import { BaseEmptyState } from "./BaseEmptyState"

type SearchEmptyStateProps = {
	/** Search query to display in headline and in text. */
	query: string
}

/**
 * Empty State of Discover Page when no search results.
 * @example <SearchEmptyState query="test" />
 */
export const SearchEmptyState: React.FC<SearchEmptyStateProps> = ({ query }) => {
	return (
		<BaseEmptyState datacy="search-empty-state" icon="weight" headline={`No results for "${query}"`}>
			{/* Content */}
			<p className="text-center">Do you know what &quot;{query}&quot; weighs? Contribute!</p>
			<p className="text-center mb-5">Or try search again.</p>

			{/* Buttons */}
			<Button to={routes.contribute.create} className="mb-3">
				Contribute
			</Button>
			<Button to={routes.weights.list({ query: "" })} kind="tertiary">
				Try again
			</Button>
		</BaseEmptyState>
	)
}
