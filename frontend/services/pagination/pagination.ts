import { RoutePagination } from "../routes/routes"
import { range } from "../utils/range"

type PaginationEllipsis = {
    content: typeof DOTS
}

type PaginationPage = {
    content: number,
    link: string
}

type PaginationService = {
    prev: string | null
    next: string | null
    pages: (PaginationPage | PaginationEllipsis)[]
}

export const DOTS = '...'
export type PaginationServiceParams = { totalItems: number, itemsPerPage: number, siblingCount: number, currentPage: number, basePath: RoutePagination, defaultItemsPerPage?: number }
export const paginationService = ({ totalItems, itemsPerPage, siblingCount, currentPage, basePath, defaultItemsPerPage }: PaginationServiceParams): PaginationService => {
    const totalPageCount = getTotalPageCount(totalItems, itemsPerPage)

    const paginationData = paginationDataService({ totalPageCount, currentPage, siblingCount })

    const pages = paginationData.map((page): (PaginationPage | PaginationEllipsis) => (page === DOTS ? {
        content: DOTS
    } : {
        content: page,
        link: basePath({ page, itemsPerPage, defaultItemsPerPage })
    }))

    const prev = currentPage === 1 ? null : basePath({ page: currentPage - 1, itemsPerPage, defaultItemsPerPage })
    const next = currentPage === totalPageCount ? null : basePath({ page: currentPage + 1, itemsPerPage, defaultItemsPerPage })

    return {
        prev,
        next,
        pages
    }
}

export type PaginationDataServiceParams = { totalPageCount: number, siblingCount: number, currentPage: number }
export const paginationDataService = ({ totalPageCount, siblingCount, currentPage }: PaginationDataServiceParams): (number | typeof DOTS)[] => {

    // Pages count is determined as siblingCount + firstPage + lastPage + currentPage + 2*DOTS
    const maxPaginationItemsLength = siblingCount * 2 + 5

    // Case 1: If the number of pages is less than the page numbers we want to show in our paginationComponent, we return the range [1..totalPageCount]
    if (maxPaginationItemsLength >= totalPageCount) {
        return range(1, totalPageCount)
    }

    // Calculate left and right sibling index and make sure they are within range 1 and totalPageCount
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPageCount)

    // We do not show dots just when there is just one page number to be inserted between the extremes of sibling and the page limits i.e 1 and totalPageCount. Hence we are using leftSiblingIndex > 2 and rightSiblingIndex < totalPageCount - 2
    const shouldShowLeftDots = leftSiblingIndex > 3
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2

    const firstPageIndex = 1
    const lastPageIndex = totalPageCount

    // Case 2: No left dots to show, but rights dots to be shown
    if (!shouldShowLeftDots && shouldShowRightDots) {
        const leftItemCount = 3 + 2 * siblingCount
        const leftRange = range(1, leftItemCount)
        return [...leftRange, DOTS, totalPageCount]
    }

    // Case 3: No right dots to show, but left dots to be shown
    if (shouldShowLeftDots && !shouldShowRightDots) {
        const rightItemCount = 3 + 2 * siblingCount
        const rightRange = range(totalPageCount - rightItemCount + 1, totalPageCount)
        return [firstPageIndex, DOTS, ...rightRange]
    }

    // Case 4: Both left and right dots to be shown
    if (shouldShowLeftDots && shouldShowRightDots) {
        const middleRange = range(leftSiblingIndex, rightSiblingIndex)
        return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex]
    }

    return []

}

export const getTotalPageCount = (totalItems: number, itemsPerPage: number) => Math.ceil(totalItems / itemsPerPage)