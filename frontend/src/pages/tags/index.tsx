import { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { Chip } from "../../components/Chip/Chip"
import { TagsEmptyState } from "../../components/EmptyState/TagsEmptyState"
import { Headline } from "../../components/Headline/Headline"
import { Pagination } from "../../components/Pagination/Pagination"
import { Seo } from "../../components/Seo/Seo"
import { Tooltip } from "../../components/Tooltip/Tooltip"
import { queryServerRequest } from "../../services/axios/axios"
import { routes } from "../../services/routes/routes"
import { generatePageString } from "../../services/seo/pageString"
import { PaginatedResponse } from "../../types/pagination"
import { Tag } from "../../types/tag"

const DEFAULT_ITEMS_PER_PAGE = 64
const ITEMS_PER_PAGE_MAXIMUM = 100
const FIRST_PAGE = 1

type TagsListProps = {
	tags: Tag[]
	currentPage: number
	totalItems: number
	limit: number
}

/**
 * Base List for tags.
 */
export default function TagsList({ tags, currentPage, totalItems, limit }: InferGetServerSidePropsType<typeof getServerSideProps>) {
	return (
		<>
			<Seo title={`All Tags${generatePageString(currentPage)}`} description="Discover all tags in the world largest database about weights." />

			<main className="container mt-5">
				{/* Headline */}
				<Headline level={3}>All tags</Headline>

				{/* Tags */}
				{tags.length === 0 ? (
					<TagsEmptyState />
				) : (
					<div datacy="tags-list-container" className="flex flex-wrap pb-3">
						{tags.map((tag) => (
							<Tooltip key={tag.name} content={`${tag.count === 1 ? "Tag is used once" : `Tag is used ${tag.count} times`}.`}>
								<Chip to={routes.tags.single(tag.name)}>
									{tag.name} ({tag.count})
								</Chip>
							</Tooltip>
						))}
					</div>
				)}

				{/* Pagination */}
				<Pagination totalItems={totalItems} currentPage={currentPage} itemsPerPage={limit} defaultItemsPerPage={DEFAULT_ITEMS_PER_PAGE} baseRoute={routes.tags.list} />
			</main>
		</>
	)
}

export const getServerSideProps: GetServerSideProps<TagsListProps> = async (context) => {
	const currentPage = parseInt((context.query.page as string) ?? FIRST_PAGE)
	const limit = parseInt((context.query.limit as string) ?? DEFAULT_ITEMS_PER_PAGE)

	// Validate Query
	if (currentPage < 1 || limit < 1 || limit > ITEMS_PER_PAGE_MAXIMUM) {
		return {
			notFound: true, // Renders 404 page
		}
	}

	// Fetch tags
	const responseTags = await queryServerRequest.get<PaginatedResponse<Tag>>(`/tags/list?page=${currentPage}&limit=${limit}`)
	const tags = responseTags.data.data

	return {
		props: {
			tags,
			currentPage,
			totalItems: responseTags.data.total,
			limit,
		},
	}
}
