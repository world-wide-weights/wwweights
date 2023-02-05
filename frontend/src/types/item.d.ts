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