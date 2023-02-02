import { Item } from "../pages/weights"

export type PaginatedResponse<T> = {
    total: number,
    page: number,
    limit: number,
    data: T[]
}

export type StatisticResponse = {
    heaviest: Item
    lightest: Item
    averageWeight: Item
}