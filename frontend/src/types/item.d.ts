export type Item = {
    id: string,
    name: string
    slug: string
    weight: Weight,
    source?: string
    image?: string
    tags: Tag[]
}

export type Weight = {
    value: number
    additionalValue?: number
    isCa: boolean
}