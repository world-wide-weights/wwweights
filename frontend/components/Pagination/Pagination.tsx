import { usePagination } from "../../hooks/usePagination"
import { DOTS } from "../../services/pagination/pagination"
import { RoutePagination } from "../../services/routes/routes"
import { Button } from "../Button/Button"
import { IconButton } from "../Button/IconButton"

export type PaginationProps = {
    /** The total number of items. */
    totalItems: number
    /** The index of current page. */
    currentPage: number
    /** Base Path of link where pages are. */
    basePath: RoutePagination
    /** The number of items to be shown per page. */
    itemsPerPage: number
    /** The default number of items to be shown per page. */
    defaultItemsPerPage?: number
    /** Customize count of siblings shown between the dots */
    siblingCount?: number
}

export const Pagination: React.FC<PaginationProps> = ({ totalItems, currentPage, basePath, itemsPerPage, defaultItemsPerPage = 16, siblingCount = 1 }) => {
    const paginationRange = usePagination({ currentPage, totalItems, siblingCount, itemsPerPage, basePath, defaultItemsPerPage })

    // If our pagination array length is less than 2 to we should not render component (because there are not enough items for pagination)
    if (currentPage === 0 || paginationRange.pages.length < 2) {
        return null
    }

    return <>
        <ul dataCy="pagination" className="flex items-center justify-center">
            {/* Left navigation arrow */}
            <li>
                <Button dataCy="pagination-button-left-desktop" to={paginationRange.prev ?? " "} disabled={!paginationRange.prev} icon="arrow_back_ios" className="hidden md:flex mr-5" kind="tertiary">Previous</Button>
                <IconButton dataCy="pagination-button-left-mobile" to={paginationRange.prev ?? " "} className="flex md:hidden" disabled={!paginationRange.prev} icon="arrow_back_ios" />
            </li>

            {paginationRange.pages.map((page, index) =>
                // If the pageItem is a DOT, render the DOTS unicode character else render our pages
                page.content === DOTS ?
                    <li dataCy="pagination-dots" key={index} className="text-gray-500">&#8230;</li> :
                    <li key={index}>
                        <Button dataCy={`pagination-button-page-${page.content}`} to={page.link} className={page.content === currentPage ? "flex justify-center items-center bg-blue-500 text-white hover:text-white focus:text-white rounded-full w-9 h-9" : "px-3 md:px-4"} kind="tertiary">
                            {page.content.toString()}
                        </Button>
                    </li>
            )}

            {/*  Right navigation arrow */}
            <li>
                <Button dataCy="pagination-button-right-desktop" to={paginationRange.next ?? " "} disabled={!paginationRange.next} icon="arrow_forward_ios" iconSlot="end" className="hidden md:flex ml-5" kind="tertiary">Next</Button>
                <IconButton dataCy="pagination-button-right-mobile" to={paginationRange.next ?? " "} className="flex md:hidden" disabled={!paginationRange.next} icon="arrow_forward_ios" />
            </li>
        </ul>
    </>
}