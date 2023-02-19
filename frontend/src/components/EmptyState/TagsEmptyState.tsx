import { routes } from "../../services/routes/routes"
import { Button } from "../Button/Button"
import { BaseEmptyState } from "./BaseEmptyState"

/**
 * Empty State of Tags Page when no tags created.
 */
export const TagsEmptyState: React.FC = () => {
    return <BaseEmptyState datacy="tags-empty-state" icon="volunteer_activism" headline="Add tags to World Wide Weights!">
        <p className="text-center mb-2">Start creating items with tags to view an overview here.</p>

        <Button to={routes.contribute.create}>Contribute</Button>
    </BaseEmptyState >
}