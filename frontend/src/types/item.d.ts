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
    user: string // TODO (Zoe-Bot): Update this to real user when api updated
    createdAt: number
}

export type Weight = {
    value: number
    additionalValue?: number
    isCa?: boolean
}

export type CreateItemForm = {
    name: string
    weight: number | string
    unit: "g" | "kg" | "T"
    additionalValue?: number | string
    isCa: boolean[]
    valueType: "exact" | "range"
    source?: string
    imageFile?: File
    tags?: string
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
    weight?: Weight
    source?: string
    image?: string
    tags?: string[]
}