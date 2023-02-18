import { NextRouter } from "next/router"
import { capitalizeFirstLetter } from "../utils/capitalizeString"

export type Crumb = {
    /** Link where the crumb is going to. */
    to?: string
    /** Text the crumb displays. */
    text: string
}

/**
 * Generate Breadcrumb Array
 * @param router Next router object generate with useRouter()
 * @returns 
 */
export const generateBreadcrumbs = (router: NextRouter): Crumb[] => {
    // Remove any query parameters, as those aren't included in breadcrumbs
    const asPathWithoutQuery = router.asPath.split("?")[0]

    // Break down the path between "/"s, removing empty entities
    // Ex:"/my/nested/path" --> ["my", "nested", "path"]
    const asPathNestedRoutes = asPathWithoutQuery.split("/")
        .filter(v => v.length > 0)

    // Iterate over the list of nested route parts and build a "crumb" object for each one.
    const crumblist = asPathNestedRoutes.map((subpath, idx) => {
        // We can get the partial nested route for the crumb by joining together the path parts up to this point.
        const to = "/" + asPathNestedRoutes.slice(0, idx + 1).join("/")

        // The text will just be the route string
        const text = capitalizeFirstLetter(subpath)
        return { to, text }
    })

    return crumblist
}