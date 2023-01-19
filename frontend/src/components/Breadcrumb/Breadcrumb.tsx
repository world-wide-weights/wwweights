import { useRouter } from "next/router";
import { Fragment, useMemo } from "react";
import { generateBreadcrumbs } from "../../services/breadcrumb/breadcrumb";
import { routes } from "../../services/routes/routes";
import { IconButton } from "../Button/IconButton";
import { Icon } from "../Icon/Icon";
import { Crumb } from "./Crumb";

type BreadcrumbProps = {
    /** Replace last item with this text. */
    customEndingText?: string
}

/**
 * Breadcrumb component, helps with deep nested routes.
 */
export const Breadcrumb: React.FC<BreadcrumbProps> = ({ customEndingText }) => {
    const router = useRouter()

    // Generate crumbs array
    const breadcrumbs = useMemo(() => generateBreadcrumbs(router), [router])

    return <div className="flex items-center gap-2 mb-2">
        <IconButton icon="home" to={routes.home} />
        {breadcrumbs.map((crumb, id) => <Fragment key={id}>
            <Icon className="text-gray-600">chevron_right</Icon>
            <Crumb {...crumb} customEndingText={customEndingText} last={id === breadcrumbs.length - 1} />
        </Fragment>)}
    </div>
}