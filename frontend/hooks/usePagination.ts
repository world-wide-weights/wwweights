import { useMemo } from "react";
import { paginationService, PaginationServiceParams } from "../services/pagination/pagination";

export const usePagination = (usePaginationProps: PaginationServiceParams) => {
    return useMemo(() => paginationService(usePaginationProps), [usePaginationProps]) // MC: Is this still working expected?
}
