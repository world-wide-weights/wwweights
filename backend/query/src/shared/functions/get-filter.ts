/**
 * @description The getFilter function is used to create a filter object for the mongo match stage
 */
export const getFilter = (
  query?: string,
  tags?: string[],
  slug?: string,
  hasImage?: boolean,
  userId?: number,
) => {
  const tagsSearch = { 'tags.name': { $all: tags } };
  const textSearch = { $text: { $search: query } };
  const tagsAsQuery = { $text: { $search: tags?.join(' ') } }; // Since we also want a relevance score for tags only searches

  // Edgecases outside of the multiFilter
  if (!query && !tags && !slug && hasImage === undefined && !userId) return {};
  if (slug) return { slug };

  const multiFilterBase = { $and: [] }; // $and can also be length 1 but not empty

  if (tags) multiFilterBase.$and.push(tagsSearch);
  if (tags && !query) multiFilterBase.$and.push(tagsAsQuery);
  if (query) multiFilterBase.$and.push(textSearch);
  if (hasImage !== undefined)
    multiFilterBase.$and.push({ image: { $exists: hasImage } });
  if (userId) multiFilterBase.$and.push({ userId });

  return multiFilterBase;
};
