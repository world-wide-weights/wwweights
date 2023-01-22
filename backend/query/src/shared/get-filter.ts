export const getFilter = (query: string, tags: string[], slug: string) => {
  if (slug) return { slug };
  if (tags && query)
    return { $and: [{ tags: { $all: tags } }, { $text: { $search: query } }] };
  if (tags) return { tags: { $all: tags } };
  if (query) return { $text: { $search: query } };
};
