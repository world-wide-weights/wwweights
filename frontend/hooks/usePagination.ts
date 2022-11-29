import { useMemo } from "react";
import { paginationService, PaginationServiceType } from "../services/pagination/pagination";

export const usePagination = (usePaginationProps: PaginationServiceType) => {
    const paginationRange = useMemo(() => paginationService(usePaginationProps), [usePaginationProps]) // MC: Is this still working expected?
    return paginationRange
}
