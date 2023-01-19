import { useRouter } from "next/router"
import { useMemo } from "react"
import { generateBreadcrumbs } from "../../services/breadcrumb/breadcrumb"
import { Breadcrumb } from "./Breadcrumb"

export type RouterBreadcrumbType = {
    /** Optional custom text on last crumb */
    customLastCrumb?: string
}

/**
 * Auto generated breadcrumb from current path
 */
export const RouterBreadcrumb: React.FC<RouterBreadcrumbType> = ({ customLastCrumb }) => {
    const router = useRouter()

    // Generate crumbs array from current path
    const breadcrumbs = useMemo(() => generateBreadcrumbs(router), [router])

    // Removes link from the last element and replaces custom endting text if set
    breadcrumbs[breadcrumbs.length - 1] = {
        text: customLastCrumb ?? breadcrumbs[breadcrumbs.length - 1].text
    }

    return <Breadcrumb breadcrumbs={breadcrumbs} />
}