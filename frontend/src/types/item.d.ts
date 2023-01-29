import { Item } from "../pages/weights"

export type ItemsResponse = {
    total: number,
    page: number,
    limit: number,
    data: Item[]
}

export type StatisticResponse = {
    heaviest: Item
    lightest: Item
    averageWeight: Item
}