import { Button } from "../Button/Button"

type CrumbProps = {
    /** Text from crumb. */
    text: string
    /** Link to where the crumb is going. */
    to?: string
}

/**
 *  Each individual "crumb" in the breadcrumbs list.
 */
export const Crumb: React.FC<CrumbProps> = ({ text, to }) => {
    // The last crumb is rendered as normal text since we are already on the page
    if (!to) {
        return <p datacy={`crumb-${text}`} className="font-medium text-gray-600">{text}</p>
    }

    // All other crumbs will be rendered as links that can be visited 
    return (
        <Button datacy={`crumb-${text}`} to={to} kind="tertiary">
            {text}
        </Button>
    )
}