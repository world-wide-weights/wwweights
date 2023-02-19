import { SortType } from "../components/Sort/Sort"
import { RoutePagination } from "../services/routes/routes"

export type PaginatedResponse<T> = {
    total: number,
    page: number,
    limit: number,
    data: T[]
}

export type PaginationBaseOptions = Partial<{
    page: number,
    itemsPerPage: number,
    defaultItemsPerPage: number
}>

export type PaginationEllipsis = {
    content: "..."
}

export type PaginationPage = {
    content: number,
    link: string
}

export type PaginationService = {
    prev: string | null
    next: string | null
    pages: (PaginationPage | PaginationEllipsis)[]
}

export type PaginationServiceParams = {
    totalItems: number,
    itemsPerPage: number,
    siblingCount: number,
    currentPage: number,
    baseRoute: RoutePagination,
    defaultItemsPerPage: number
    query: string
    sort: SortType
}

export type PaginationDataServiceParams = {
    totalPageCount: number,
    siblingCount: number,
    currentPage: number
}