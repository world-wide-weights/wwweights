import { SortEnum } from '../items/interfaces/sortEnum';

// There has not been any obvious way how to deal with this kind of syntax to reduce lines of code
const textSearchParams = {
  boosted: 'DESC',
  score: { $meta: 'textScore' },
  name: 'ASC',
};

export const getSort = (sort: string, textSearch: boolean) => {
  if (sort === SortEnum.LIGHTEST && textSearch)
    return {
      'weight.value': 'ASC',
      ...textSearchParams,
    };
  if (sort === SortEnum.LIGHTEST)
    return {
      'weight.value': 'ASC',
    };

  if (sort === SortEnum.HEAVIEST && textSearch)
    return {
      'weight.value': 'DESC',
      ...textSearchParams,
    };
  if (sort === SortEnum.HEAVIEST)
    return {
      ['weight.value']: 'DESC',
    };
  if (sort === SortEnum.RELEVANCE && textSearch) {
    return textSearchParams;
  }
  if (sort === SortEnum.RELEVANCE) {
    return { createdAt: 'DESC' };
  }
};
