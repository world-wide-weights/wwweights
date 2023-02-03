export const getStructuredDataWebsite = () => {
  return {
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "url": `${process.env.NEXT_PUBLIC_CLIENT_BASE_URL}`,
      "name": "World Wide Weights",
      "alternateName": "WWWeights",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${process.env.NEXT_PUBLIC_CLIENT_BASE_URL}/weights?query={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    })
  }
}