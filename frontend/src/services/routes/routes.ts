import { SortType } from "../../components/Sort/Sort"
import { PaginationBaseOptions } from "../../types/pagination"

/**
 * Define Routes for frontend
 * Not optional params / queries via function paramters: e.g.: post(slug: string) => `/posts/${slug}`
 * Optional params / queries via options object: e.g.: post(options?: Partial<PostOptions>) => ...
 */
export const routes = {
	home: "/",
	weights: {
		list: (options?: PaginationBaseOptions & { query?: string; sort?: SortType }) => {
			if (!options) return "/weights"

			const hasCustomLimit = options.itemsPerPage !== options.defaultItemsPerPage

			const queryString = new URLSearchParams({
				...(options.page && options.page > 1 && { page: options.page.toString() }),
				...(options.itemsPerPage && hasCustomLimit && { limit: options.itemsPerPage.toString() }),
				...(options.query && { query: options.query }),
				...(options.sort && { sort: options.sort }),
			}).toString()

			return `/weights${queryString !== "" ? `?${queryString}` : ""}`
		},
		single: (slug: string, options?: { tab: string }) => {
			const queryString = new URLSearchParams({
				...(options && options.tab && { tab: options.tab }),
			}).toString()

			return `/weights/${slug}${queryString !== "" ? `?${queryString}` : ""}`
		},
	},
	tags: {
		list: (options?: PaginationBaseOptions) => {
			if (!options) return "/tags"

			const hasCustomLimit = options.itemsPerPage !== options.defaultItemsPerPage

			const queryString = new URLSearchParams({
				...(options.page && options.page !== 1 && { page: options.page.toString() }),
				...(options.itemsPerPage && hasCustomLimit && { limit: options.itemsPerPage.toString() }),
			}).toString()

			return `/tags${queryString !== "" ? `?${queryString}` : ""}`
		},
		single: (slug: string) => `/weights?query=${slug}`,
	},
	account: {
		login: "/account/login",
		register: "/account/register",
		profile: (options?: PaginationBaseOptions) => {
			if (!options) return "/account/profile"

			const hasCustomLimit = options.itemsPerPage !== options.defaultItemsPerPage

			const queryString = new URLSearchParams({
				...(options.page && options.page > 1 && { page: options.page.toString() }),
				...(options.itemsPerPage && hasCustomLimit && { limit: options.itemsPerPage.toString() }),
			}).toString()

			return `/account/profile${queryString !== "" ? `?${queryString}` : ""}`
		},
	},
	contribute: {
		create: "/contribute/create",
		edit: (slug: string) => `/contribute/edit/${slug}`,
	},
	misc: {
		index: "/misc",
		contact: "/misc/contact",
		terms: "/misc/terms-and-conditions",
		privacy: "/misc/privacy-policy",
	},
} as const

export type RoutePagination = (options?: PaginationBaseOptions & { query?: string; sort?: SortType }) => string
