export const getFilter = (query: string, tags: string[], slug: string) => {
  const tagsSearch = { 'tags.name': { $all: tags } };
  const textSearch = { $text: { $search: query } };
  if (slug) return { slug };
  if (tags && query)
    return {
      $and: [tagsSearch, textSearch],
    };
  if (tags) return tagsSearch;
  if (query) return textSearch;
};
