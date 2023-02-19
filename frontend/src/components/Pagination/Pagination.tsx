import { usePagination } from "../../hooks/usePagination"
import { Ellipsis } from "../../services/pagination/pagination"
import { RoutePagination } from "../../services/routes/routes"
import { Button } from "../Button/Button"
import { IconButton } from "../Button/IconButton"
import { SortType } from "../Sort/Sort"
import { Tooltip } from "../Tooltip/Tooltip"

export type PaginationProps = {
    /** The total number of items. */
    totalItems: number
    /** The index of current page. */
    currentPage: number
    /** Base Path of link where pages are. */
    baseRoute: RoutePagination
    /** The number of items to be shown per page. */
    itemsPerPage: number
    /** The default number of items to be shown per page. */
    defaultItemsPerPage?: number
    /** Customize count of siblings shown between the dots. Examples: `1 => 1 .. (4) 5 (6) ... 15` `2 => 1 .. (4) (5) 6 (7) (8) ... 15` */
    siblingCount?: number
    /** Search query for baseurl. */
    query?: string
    /** Sort type for baseurl. */
    sort?: SortType
}

/**
 * Pagination component contains the complete logic for paginate correct.
 * @example <Pagination totalItems={100} currentPage={1} baseRoute={routes.weights.list} itemsPerPage={16} />
 */
export const Pagination: React.FC<PaginationProps> = ({ totalItems, currentPage, baseRoute, itemsPerPage, query = "", sort = "relevance", defaultItemsPerPage = 16, siblingCount = 1 }) => {
    const paginationService = usePagination({ currentPage, totalItems, siblingCount, itemsPerPage, baseRoute, defaultItemsPerPage, query, sort })

    // If our pagination array length is less than 2 to we should not render component (because there are not enough items for pagination)
    if (currentPage === 0 || paginationService.pages.length < 2) {
        return null
    }

    return <>
        <ul datacy="pagination" className="flex items-center justify-center">
            {/* Left navigation arrow */}
            <li>
                <Button datacy="pagination-button-previous" to={paginationService.prev ?? " "} disabled={!paginationService.prev} icon="arrow_back_ios_new" className={`${!paginationService.prev ? "hidden" : "flex"} sm:hidden md:flex mr-5`} kind="tertiary">Previous</Button>
                <Tooltip wrapperClassname="hidden sm:flex md:hidden" content="Previus page">
                    <IconButton datacy="pagination-button-previous-tablet" to={paginationService.prev ?? " "} disabled={!paginationService.prev} icon="arrow_back_ios_new" />
                </Tooltip>
            </li>

            {paginationService.pages.map((page, index) =>
                // If the pageItem is a Ellipsis, render the Ellipsis else render page
                page.content === Ellipsis ?
                    <li datacy="pagination-dots" key={index} className="hidden sm:list-item text-gray-500">&#8230;</li> :
                    <li className="hidden sm:list-item" key={index}>
                        <Button datacy={`pagination-button-page-${page.content}`} to={page.link} className={`flex justify-center items-center rounded-full min-w-[36px] w-9 h-9 ${page.content === currentPage ? "bg-blue-500 text-white hover:text-white focus:text-white" : "hover:bg-gray-200"}`} kind="tertiary">
                            {page.content.toString()}
                        </Button>
                    </li>
            )}

            {/* Right navigation arrow */}
            <li>
                <Button datacy="pagination-button-next" to={paginationService.next ?? " "} disabled={!paginationService.next} icon="arrow_forward_ios" iconSlot="end" className={`${!paginationService.next ? "hidden" : "flex"} sm:hidden md:flex ml-5`} kind="tertiary">Next</Button>
                <Tooltip wrapperClassname="hidden sm:flex md:hidden" content="Next page">
                    <IconButton datacy="pagination-button-next-tablet" to={paginationService.next ?? " "} disabled={!paginationService.next} icon="arrow_forward_ios" />
                </Tooltip>
            </li>
        </ul>
    </>
}