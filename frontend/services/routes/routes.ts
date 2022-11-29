
/**
 * Not optional params / queries via function paramters: e.g.: post(slug: string) => `/posts/${slug}`
 * Optional params / queries via options object: e.g.: post(options?: Partial<PostOptions>) => ...
 */
export const routes = {
    home: "/",
    weights: {
        list: (options?: PaginationType) => {
            return `/weights`
        },
        single: (slug: string) => `/weights/${slug}`
    },
    legal: {
        imprint: "/legal/imprint",
        privacy: "/legal/privacy-policy"
    }
}

export type PaginationType = Partial<{ page: number, itemsPerPage: number, defaultItemsPerPage: number }>
export type RoutePagination = (query?: PaginationType) => string