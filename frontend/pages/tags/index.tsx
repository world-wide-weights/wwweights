import { GetServerSideProps, InferGetServerSidePropsType } from "next"
import Head from "next/head"
import { Button } from "../../components/Button/Button"
import { Headline } from "../../components/Headline/Headline"
import { Tag } from "../../components/Tag/Tag"

const DEFAULT_ITEMS_PER_PAGE = 64
const ITEMS_PER_PAGE_MAXIMUM = 100
const FIRST_PAGE = 1

export type Tag = {
    name: string
    slug: string
}

type TagsListProps = {
    tags: Tag[],
    currentPage: number,
    limit: number
}

/** Base List for tags */
export default function TagsList({ tags, currentPage, limit }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const siteTitle = `All Tags ${currentPage > 1 ? `| Page ${currentPage} ` : ``}- World Wide Weights`

    const hasCustomLimit = limit !== DEFAULT_ITEMS_PER_PAGE

    // Previous Button
    const previousButtonQueryString = new URLSearchParams({
        ...(currentPage > 2 && { page: (currentPage - 1).toString() }), // At page 3 we want to have a page query 
        ...(hasCustomLimit && { limit: limit.toString() }), // When we have a custom limit of items, we want to provide it
    }).toString()
    const previousButtonLink = `/tags${previousButtonQueryString !== "" ? `?${previousButtonQueryString}` : ``}`

    // Next Button
    const nextButtonQueryString = new URLSearchParams({
        ...(true && { page: (currentPage + 1).toString() }), // Replace `true` with maxPage logic later
        ...(hasCustomLimit && { limit: limit.toString() }),
    }).toString()
    const nextButtonLink = `/tags${nextButtonQueryString !== "" ? `?${nextButtonQueryString}` : ``}`

    return (<>
        {/* Meta Tags */}
        <Head>
            <title>{siteTitle}</title>
        </Head>

        <div className="container">
            {/* Headline */}
            <Headline level={3}>All tags</Headline>

            {/* tags */}
            <div className="flex flex-wrap">
                {tags.map((tag) => <Tag key={tag.name} to="#">{tag.name}</Tag>)}
            </div>

            {/* Pagination */}
            
        </div>
    </>
    )
}

export const getServerSideProps: GetServerSideProps<TagsListProps> = async (context) => {
    const currentPage = parseInt(context.query.page as string ?? FIRST_PAGE)
    const limit = parseInt(context.query.limit as string ?? DEFAULT_ITEMS_PER_PAGE)

    // Validate Query
    if (currentPage < 1 || limit < 1 || limit > ITEMS_PER_PAGE_MAXIMUM) {
        return {
            notFound: true // Renders 404 page
        }
    }

    const response = await fetch(`http://localhost:3004/api/query/v1/tags/getList?page=${currentPage}&limit=${limit}`)
    const data = await response.json()
    return {
        props: {
            tags: data,
            currentPage,
            limit
        }
    }
}
