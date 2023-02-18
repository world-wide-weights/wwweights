import { useMemo } from "react"
import { PaginationService, paginationService, PaginationServiceParams } from "../services/pagination/pagination"

/**
 * Pagination hook, creates the pagination service object
 * @param usePaginationProps params for pagination 
 * @returns pagination service object
 */
export const usePagination = (usePaginationProps: PaginationServiceParams): PaginationService => {
    return useMemo(() => paginationService(usePaginationProps), [usePaginationProps])
}
