import { useRouter } from "next/router"
import { useMemo } from "react"
import { generateBreadcrumbs } from "../../services/breadcrumb/breadcrumb"
import { Breadcrumb } from "./Breadcrumb"

export type RouterBreadcrumbType = {
    /** Replace last item with this text. */
    customEndingText?: string
}

export const RouterBreadcrumb: React.FC<RouterBreadcrumbType> = ({ customEndingText }) => {
    const router = useRouter()

    // Generate crumbs array from current URL
    const breadcrumbs = useMemo(() => generateBreadcrumbs(router), [router])

    // Removes link from the last element and replaces custom endting text if set
    breadcrumbs[breadcrumbs.length - 1] = {
        text: customEndingText ?? breadcrumbs[breadcrumbs.length - 1].text
    }

    return <Breadcrumb breadcrumbs={breadcrumbs} />
}