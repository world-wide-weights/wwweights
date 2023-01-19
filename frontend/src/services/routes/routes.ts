import { SortType } from "../../components/Sort/Sort"
import { PaginationBaseOptions } from "../pagination/pagination"

/**
 * Define Routes for frontend
 * Not optional params / queries via function paramters: e.g.: post(slug: string) => `/posts/${slug}`
 * Optional params / queries via options object: e.g.: post(options?: Partial<PostOptions>) => ...
 */
export const routes = {
    home: "/",
    weights: {
        list: (options?: PaginationBaseOptions & { query?: string, sort?: SortType }) => {
            if (!options)
                return "/weights"

            const hasCustomLimit = options.itemsPerPage !== options.defaultItemsPerPage

            const queryString = new URLSearchParams({
                ...(options.page && options.page > 1 && { page: options.page.toString() }),
                ...(options.itemsPerPage && hasCustomLimit && { limit: options.itemsPerPage.toString() }),
                ...(options.query && { query: options.query }),
                ...(options.sort && { sort: options.sort })
            }).toString()

            return `/weights${queryString !== "" ? `?${queryString}` : ""}`
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

            return `/tags${queryString !== "" ? `?${queryString}` : ""}`
        },
        single: (slug: string) => `/weights?query=${slug}`
    },
    account: {
        login: "/account/login",
        register: "/account/register",
        profile: () => "/account/profile"
    },
    contribute: {
        create: "/contribute/create"
    },
    legal: {
        terms: "/legal/terms-of-service",
        privacy: "/legal/privacy-policy"
    }
} as const

// Define types here 
// TODO: Improve type connection between defintion here and up routes
// TODO (Zoe-Bot): Change sort types when correct api implemented
export type RoutePagination = (options?: PaginationBaseOptions & { query?: string, sort?: SortType }) => string

