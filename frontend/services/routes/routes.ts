/**
 * Not optional params / queries via function paramters: e.g.: post(slug: string) => `/posts/${slug}`
 * Optional params / queries via options object: e.g.: post(options?: Partial<PostOptions>) => ...
 */
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
