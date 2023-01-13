import { Button } from "../Button/Button"

type CrumbProps = {
    /** Text from crumb. */
    text: string
    /** Link to where the crumb is going. */
    to: string
    /** True when it is the last element of the breadcrumb list. The last element is only text not a link. */
    last: boolean
}

/**
 *  Each individual "crumb" in the breadcrumbs list
 */
export const Crumb: React.FC<CrumbProps> = ({ text, to, last = false }) => {
    // The last crumb is rendered as normal text since we are already on the page
    if (last) {
        return <p className="font-medium text-gray-600">{text}</p>
    }

    // All other crumbs will be rendered as links that can be visited 
    return (
        <Button to={to} kind="tertiary">
            {text}
        </Button>
    )
}