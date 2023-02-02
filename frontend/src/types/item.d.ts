
export type PaginatedResponse<T> = {
    total: number,
    page: number,
    limit: number,
    data: T[]
}