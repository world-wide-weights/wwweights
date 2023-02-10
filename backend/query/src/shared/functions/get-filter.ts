export const getFilter = (
  query?: string,
  tags?: string[],
  slug?: string,
  hasimage?: boolean,
  userid?: number,
) => {
  const tagsSearch = { 'tags.name': { $all: tags } };
  const textSearch = { $text: { $search: query } };
  const tagsAsQuery = { $text: { $search: tags?.join(' ') } }; // Since we also want a relevance score for tags only

  // Edgecases outside of the multiFilter
  if (!query && !tags && !slug && hasimage === undefined && !userid) return {};
  if (slug) return { slug };

  const multiFilterBase = { $and: [] }; // $and can also be length 1 but not empty

  if (tags) multiFilterBase.$and.push(tagsSearch);
  if (tags && !query) multiFilterBase.$and.push(tagsAsQuery);
  if (query) multiFilterBase.$and.push(textSearch);
  if (hasimage !== undefined)
    multiFilterBase.$and.push({ image: { $exists: hasimage } });
  if (userid) multiFilterBase.$and.push({ user: userid });

  return multiFilterBase;
};
