import { ItemSortEnum } from '../items/interfaces/item-sort-enum';

// There has not been any obvious way how to deal with this kind of syntax to reduce lines of code
const textSearchParams: { score: any; name: 1 | -1 } = {
  score: { $meta: 'textScore' },
  name: 1,
};

export const getSort = (sort: string, textSearch: boolean) => {
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
