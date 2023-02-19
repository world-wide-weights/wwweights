import { ItemSortEnum } from '../../items/enums/item-sort-enum';
import { getSort } from './get-sort';
const textSearchParams = {
  score: { $meta: 'textScore' },
  name: 1,
};

describe('getSort', () => {
  it('should return createdAt descending by default', () => {
    expect(getSort(ItemSortEnum.RELEVANCE, false)).toEqual({
      createdAt: -1,
    });
  });
  it('should return weight.value ascending', () => {
    expect(getSort(ItemSortEnum.LIGHTEST, false)).toEqual({
      'weight.value': 1,
    });
  });
  it('should return weight.value descending', () => {
    expect(getSort(ItemSortEnum.HEAVIEST, false)).toEqual({
      'weight.value': -1,
    });
  });
  it('should return weight.value ascending and textSearch', () => {
    expect(getSort(ItemSortEnum.LIGHTEST, true)).toEqual({
      'weight.value': 1,
      ...textSearchParams,
    });
  });
  it('should return weight.value descending and textSearch', () => {
    expect(getSort(ItemSortEnum.HEAVIEST, true)).toEqual({
      'weight.value': -1,
      ...textSearchParams,
    });
  });
  it('should return textSearch', () => {
    expect(getSort(ItemSortEnum.RELEVANCE, true)).toEqual(textSearchParams);
  });
});
