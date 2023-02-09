import { ItemSortEnum } from '../../items/interfaces/item-sort-enum';

const textSearchParams = {
  score: { $meta: 'textScore' },
  name: 1,
};

export const getSort = (sort: ItemSortEnum, textSearch: boolean) => {
  if (sort === ItemSortEnum.LIGHTEST && textSearch)
    return { 'weight.value': 1, ...textSearchParams };
  if (sort === ItemSortEnum.LIGHTEST) return { 'weight.value': 1 };
  if (sort === ItemSortEnum.HEAVIEST && textSearch)
    return { 'weight.value': -1, ...textSearchParams };
  if (sort === ItemSortEnum.HEAVIEST) return { 'weight.value': -1 };
  if (sort === ItemSortEnum.RELEVANCE && textSearch) {
    return textSearchParams;
  }
  return { createdAt: -1 };
};
