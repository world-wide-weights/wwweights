import { DOTS, usePagination } from "../../hooks/usePagination"
import { Button } from "../Button/Button"

export type PaginationProps = {
    /** The total number of items. */
    totalItems: number
    /** The index of current page. */
    currentPage: number
    /** The number dictating how many items a page contains. */
    pageSize: number
    /** Base Path of link where pages are. */
    basePath: string
    /** The number dictating how many items a page contains. */
    defaultItemsPerPage?: number
    /** Customize count of siblings shown between the dots */
    siblingCount?: number
}

export const Pagination: React.FC<PaginationProps> = ({ totalItems, currentPage, pageSize, basePath, defaultItemsPerPage = 16, siblingCount = 1 }) => {
    const paginationRange = usePagination({ currentPage, totalItems, siblingCount, pageSize })
    const hasCustomLimit = pageSize !== defaultItemsPerPage
    const lastPage = paginationRange[paginationRange.length - 1]

    // If our pagination array length is less than 2 to we should not render component (because there are not enough items for pagination)
    if (currentPage === 0 || paginationRange.length < 2) {
        return null
    }

    // Next Button
    const nextButtonQueryString = new URLSearchParams({
        page: (currentPage + 1).toString(), // Replace `true` with maxPage logic later
        ...(hasCustomLimit && { limit: pageSize.toString() }),
    }).toString()
    const nextButtonLink = `${basePath}${nextButtonQueryString !== "" ? `?${nextButtonQueryString}` : ``}`

    // Previous Button
    const previousButtonQueryString = new URLSearchParams({
        page: (currentPage - 1).toString(), // At page 3 we want to have a page query 
        ...(hasCustomLimit && { limit: pageSize.toString() }), // When we have a custom limit of items, we want to provide it
    }).toString()
    const previousButtonLink = `${basePath}${previousButtonQueryString !== "" ? `?${previousButtonQueryString}` : ``}`

    const pageLink = (pageNumber: number | string) => {
        const pageButtonQueryString = new URLSearchParams({
            page: pageNumber.toString(), // At page 3 we want to have a page query 
            ...(hasCustomLimit && { limit: pageSize.toString() }), // When we have a custom limit of items, we want to provide it
        }).toString()

        return `${basePath}${pageButtonQueryString !== "" ? `?${pageButtonQueryString}` : ``}`
    }

    return (
        <ul>
            {/* Left navigation arrow */}
            <li>
                <Button to={previousButtonLink} disabled={currentPage === 1} className="mr-5" kind="tertiary">Previous</Button>
            </li>
            {paginationRange.map((pageNumber, index) => {
                // If the pageItem is a DOT, render the DOTS unicode character
                if (pageNumber === DOTS) {
                    return <li key={index} className="pagination-item dots">&#8230;</li>;
                }

                // Render our Page Pills
                return (
                    <Button key={index} to={pageLink(pageNumber)} className={pageNumber === currentPage ? "text-blue-500 focus:text-blue-500" : ""} kind="tertiary">
                        {pageNumber.toString()}
                    </Button>
                );
            })}
            {/*  Right Navigation arrow */}
            <li>
                <Button to={nextButtonLink} disabled={currentPage === lastPage} kind="tertiary">Next</Button>
            </li>
        </ul >
    );
}