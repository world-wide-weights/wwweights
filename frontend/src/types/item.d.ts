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

// "" is when the field is empty
export type CreateEditItemForm = {
    name: string
    weight: number | ""
    unit: "g" | "kg" | "T"
    additionalValue?: number | ""
    isCa: [string] | []
    valueType: "exact" | "range"
    source?: string
    imageFile?: File | null
    tags?: string[]
}

export type CreateItemDto = {
    name: string
    weight: Weight
    source?: string
    image?: string
    tags?: string[]
}

export type EditItemDto = Partial<{
    name: string
    weight: Partial<{
        value: number,
        additionalValue: number | null
        isCa: boolean
    }>
    source: string | null
    image: string | null
    tags: Partial<{
        push: string[]
        pull: string[]
    }>
}>
