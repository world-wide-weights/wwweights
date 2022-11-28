import { useMemo } from "react";
import { PaginationProps } from "../components/Pagination/Pagination";
import { paginationService } from "../services/pagination/pagination";

type UsePaginationProps = Omit<PaginationProps, "basePath" | "defaultItemsPerPage">

export const usePagination = (usePaginationProps: UsePaginationProps) => {
    const paginationRange = useMemo(() => paginationService(usePaginationProps), [usePaginationProps]) // MC: Is this still working expected?
    return paginationRange
}
