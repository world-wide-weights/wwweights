export const getFilter = (query: string, tags?: string[], slug?: string) => {
  const tagsSearch = { 'tags.name': { $all: tags } };
  const textSearch = { $text: { $search: query } };
  if (slug) return { slug };
  if (tags && query) return { $and: [tagsSearch, textSearch] };
  if (tags)
    // This is currently the ugly solution, we don't use itemsByTag yet, but still need a relevance score when searching for tags
    return { $and: [tagsSearch, { $text: { $search: tags.join(' ') } }] };
  if (query) return textSearch;
  return {};
};
