/**
 * Creates structured data for the website in JSON-LD format.
 * The data includes information about the website URL, name, alternate name,
 * and potential action for search.
 *
 * The structured data follows the schema.org WebSite specification,
 * and is used to improve search engine optimization (SEO) and give context to search engines.
 */
export const getStructuredDataWebsite = {
	__html: JSON.stringify({
		"@context": "https://schema.org",
		"@type": "WebSite",
		url: `${process.env.NEXT_PUBLIC_CLIENT_BASE_URL}`,
		name: "World Wide Weights",
		alternateName: "WWWeights",
		potentialAction: {
			"@type": "SearchAction",
			target: {
				"@type": "EntryPoint",
				urlTemplate: `${process.env.NEXT_PUBLIC_CLIENT_BASE_URL}/weights?query={search_term_string}`,
			},
			"query-input": "required name=search_term_string",
		},
	}),
}
