import { PaginationBaseOptions } from "../pagination/pagination"

/**
 * Define Routes for frontend
 * Not optional params / queries via function paramters: e.g.: post(slug: string) => `/posts/${slug}`
 * Optional params / queries via options object: e.g.: post(options?: Partial<PostOptions>) => ...
 */
export const routes = {
    home: "/",
    weights: {
        list: (options?: PaginationBaseOptions) => {
            if (!options)
                return "/weights"

            const hasCustomLimit = options.itemsPerPage !== options.defaultItemsPerPage

            const queryString = new URLSearchParams({
                ...(options.page && options.page !== 1 && { page: options.page.toString() }),
                ...(options.itemsPerPage && hasCustomLimit && { limit: options.itemsPerPage.toString() }),
            }).toString()

            return `/weights${queryString !== "" ? `?${queryString}` : ``}`
        },
        single: (slug: string) => `/weights/${slug}`
    },
    tags: {
        list: (options?: PaginationBaseOptions) => {
            if (!options)
                return "/tags"

            const hasCustomLimit = options.itemsPerPage !== options.defaultItemsPerPage

            const queryString = new URLSearchParams({
                ...(options.page && options.page !== 1 && { page: options.page.toString() }),
                ...(options.itemsPerPage && hasCustomLimit && { limit: options.itemsPerPage.toString() }),
            }).toString()

            return `/tags${queryString !== "" ? `?${queryString}` : ``}`
        },
        single: (slug: string) => `/tags/${slug}`
    },
    legal: {
        imprint: "/legal/imprint",
        privacy: "/legal/privacy-policy"
    }
} as const

// Define types here 
// TODO: Improve type connection between defintion here and up routes
export type RoutePagination = (options?: PaginationBaseOptions) => string
