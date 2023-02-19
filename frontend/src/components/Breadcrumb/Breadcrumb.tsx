import { Fragment } from "react"
import { Crumb as CrumbType } from "../../services/breadcrumb/breadcrumb"
import { routes } from "../../services/routes/routes"
import { IconButton } from "../Button/IconButton"
import { Icon } from "../Icon/Icon"
import { Tooltip } from "../Tooltip/Tooltip"
import { Crumb } from "./Crumb"

type BreadcrumbProps = {
    /** Breadcrumbs */
    breadcrumbs: CrumbType[]
}

/**
 * Breadcrumb component, helps with deep nested routes.
 * @example <Breadcrumb breadcrumbs={[{ to: "/home", text: "Home" }]} />
 */
export const Breadcrumb: React.FC<BreadcrumbProps> = ({ breadcrumbs }) => {
    return <div datacy="breadcrumb" className="flex items-center gap-2 mb-1">
        {/* Home */}
        <Tooltip content="Go home">
            <IconButton datacy="breadcrumb-home" icon="home" to={routes.home} />
        </Tooltip>

        {/* Breadcrumbs */}
        {breadcrumbs.map(({ to, text }, index) => <Fragment key={index}>
            <Icon className="text-gray-600" datacy="breadcrumb-icon">chevron_right</Icon>
            <Crumb text={text} to={to} />
        </Fragment>)}
    </div>
}