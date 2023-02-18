import { useMemo } from "react"
import { paginationService } from "../services/pagination/pagination"
import { PaginationService, PaginationServiceParams } from "../types/pagination"

/**
 * Pagination hook, creates the pagination service object
 * @param usePaginationProps params for pagination 
 * @returns pagination service object
 */
export const usePagination = (usePaginationProps: PaginationServiceParams): PaginationService => {
    return useMemo(() => paginationService(usePaginationProps), [usePaginationProps])
}
