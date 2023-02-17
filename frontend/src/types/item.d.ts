import { Tag } from "./tag"

export type PaginatedResponse<T> = {
    total: number,
    page: number,
    limit: number,
    data: T[]
}

export type Item = {
    name: string
    slug: string
    weight: Weight
    source?: string
    image?: string
    tags: Tag[]
    userId: number
    createdAt: number
}

export type Weight = {
    value: number
    additionalValue?: number
    isCa?: boolean
}

export type CreateEditItemForm = {
    name: string
    weight: number | string
    unit: "g" | "kg" | "T"
    additionalValue?: number | string
    isCa: string[]
    valueType: "exact" | "range"
    source?: string
    imageFile?: File
    tags?: string[]
}

export type CreateItemDto = {
    name: string
    weight: Weight
    source?: string
    image?: string
    tags?: string[]
}

export type UpdateItemDto = {
    name?: string
    weight?: {
        value?: number,
        additionalValue?: number | null
        isCa?: boolean
    }
    source?: string | null
    image?: string | null
    tags?: {
        push?: string[]
        pull?: string[]
    }
}