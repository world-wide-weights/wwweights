import { DOTS, usePagination } from "../../hooks/usePagination"
import { Button } from "../Button/Button"
import { IconButton } from "../Button/IconButton"

export type PaginationProps = {
    /** The total number of items. */
    totalItems: number
    /** The index of current page. */
    currentPage: number
    /** Base Path of link where pages are. */
    basePath: string
    /** The number dictating how many items a page contains. */
    itemsPerPage: number
    /** The number dictating how many items a page contains. */
    defaultItemsPerPage?: number
    /** Customize count of siblings shown between the dots */
    siblingCount?: number
}

export const Pagination: React.FC<PaginationProps> = ({ totalItems, currentPage, basePath, itemsPerPage, defaultItemsPerPage = 16, siblingCount = 1 }) => {
    const paginationRange = usePagination({ currentPage, totalItems, siblingCount, itemsPerPage })

    // If our pagination array length is less than 2 to we should not render component (because there are not enough items for pagination)
    if (currentPage === 0 || paginationRange.length < 2) {
        return null
    }

    const hasCustomLimit = itemsPerPage !== defaultItemsPerPage
    const lastPage = paginationRange[paginationRange.length - 1]

    // Next Button
    const nextButtonQueryString = new URLSearchParams({
        page: (currentPage + 1).toString(), // Replace `true` with maxPage logic later
        ...(hasCustomLimit && { limit: itemsPerPage.toString() }),
    }).toString()
    const nextButtonLink = `${basePath}${nextButtonQueryString !== "" ? `?${nextButtonQueryString}` : ``}`

    // Previous Button
    const previousButtonQueryString = new URLSearchParams({
        page: (currentPage - 1).toString(), // At page 3 we want to have a page query 
        ...(hasCustomLimit && { limit: itemsPerPage.toString() }), // When we have a custom limit of items, we want to provide it
    }).toString()
    const previousButtonLink = `${basePath}${previousButtonQueryString !== "" ? `?${previousButtonQueryString}` : ``}`

    // Page Link Buttons
    const pageLink = (pageNumber: number | string) => {
        const pageButtonQueryString = new URLSearchParams({
            page: pageNumber.toString(), // At page 3 we want to have a page query 
            ...(hasCustomLimit && { limit: itemsPerPage.toString() }), // When we have a custom limit of items, we want to provide it
        }).toString()

        return `${basePath}${pageButtonQueryString !== "" ? `?${pageButtonQueryString}` : ``}`
    }

    return <>
        <ul className="flex items-center justify-center">
            {/* Left navigation arrow */}
            <li>
                <Button to={previousButtonLink} disabled={currentPage === 1} icon="arrow_back_ios" className="hidden md:flex mr-5" kind="tertiary">Previous</Button>
                <IconButton to={previousButtonLink} className="flex md:hidden" disabled={currentPage === 1} icon="arrow_back_ios" />
            </li>

            {paginationRange.map((pageNumber, index) =>
                // If the pageItem is a DOT, render the DOTS unicode character else render our pages
                pageNumber === DOTS ?
                    <li key={index} className="text-gray-500">&#8230;</li> :
                    <li key={index}>
                        <Button to={pageLink(pageNumber)} className={pageNumber === currentPage ? "flex justify-center items-center bg-blue-500 text-white hover:text-white focus:text-white rounded-full w-9 h-9" : "px-3 md:px-4"} kind="tertiary">
                            {pageNumber.toString()}
                        </Button>
                    </li>
            )}

            {/*  Right navigation arrow */}
            <li>
                <Button to={nextButtonLink} disabled={currentPage === lastPage} iconEnd="arrow_forward_ios" className="hidden md:flex ml-5" kind="tertiary">Next</Button>
                <IconButton to={nextButtonLink} className="flex md:hidden" disabled={currentPage === lastPage} icon="arrow_forward_ios" />
            </li>
        </ul>
    </>
}