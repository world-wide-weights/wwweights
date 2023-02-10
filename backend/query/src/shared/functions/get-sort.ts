import { ItemSortEnum } from '../../items/interfaces/item-sort-enum';

const textSearchParams = {
  score: { $meta: 'textScore' },
  name: 1,
};

export const getSort = (sort: ItemSortEnum, textSearch: boolean) => {
  if (sort === ItemSortEnum.RELEVANCE && !textSearch) return { createdAt: -1 };
  if (sort === ItemSortEnum.RELEVANCE && textSearch) {
    return textSearchParams;
  }

  let sortBase = {};

  if (sort === ItemSortEnum.LIGHTEST) sortBase['weight.value'] = 1;
  if (sort === ItemSortEnum.HEAVIEST) sortBase['weight.value'] = -1;
  if (textSearch) sortBase = { ...sortBase, ...textSearchParams };

  return sortBase;
};
