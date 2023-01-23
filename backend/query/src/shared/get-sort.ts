import { SortEnum } from '../items/interfaces/sortEnum';

// There has not been any obvious way how to deal with this kind of syntax to reduce lines of code
const textSearchParams: { score: any; name: 1 | -1 } = {
  score: { $meta: 'textScore' },
  name: 1,
};

export const getSort = (sort: string, textSearch: boolean) => {
  if (sort === SortEnum.LIGHTEST && textSearch)
    return { 'weight.value': 1, ...textSearchParams };
  if (sort === SortEnum.LIGHTEST) return { 'weight.value': 1 };
  if (sort === SortEnum.HEAVIEST && textSearch)
    return { 'weight.value': -1, ...textSearchParams };
  if (sort === SortEnum.HEAVIEST) return { 'weight.value': -1 };
  if (sort === SortEnum.RELEVANCE && textSearch) {
    return textSearchParams;
  }
  return { createdAt: -1 };
};
