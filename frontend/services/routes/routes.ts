export const routes = {
    home: "/",
    weights: {
        list: (query?: Partial<{ page: number, limit: number }>) => `/weights`,
        single: (slug: string) => `/weights/${slug}`
    },
    legal: {
        imprint: "/legal/imprint",
        privacy: "/legal/privacy-policy"
    }
}
