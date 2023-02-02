export type Item = {
    id: string,
    name: string
    slug: string
    weight: Weight,
    source?: string
    image?: string
    tags: Tag[]
    user: string
    createdAt: number // timestamp when item got created
}

export type Weight = {
    value: number
    additionalValue?: number
    isCa?: boolean
}