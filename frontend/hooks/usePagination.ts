import { useMemo } from "react";
import { paginationService, PaginationServiceParams } from "../services/pagination/pagination";

export const usePagination = (usePaginationProps: PaginationServiceParams) => {
    const paginationRange = useMemo(() => paginationService(usePaginationProps), [usePaginationProps]) // MC: Is this still working expected?
    return paginationRange
}
