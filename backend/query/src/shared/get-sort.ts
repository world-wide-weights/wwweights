// There has not been any obvious way how to deal with this kind of syntax to reduce lines of code
const textSearchParams = {
  boosted: 'DESC',
  score: { $meta: 'textScore' },
  name: 'ASC',
};

export const getSort = (sort: string, textSearch: boolean) => {
  if (sort === 'lightest' && textSearch)
    return {
      'weight.value': 'ASC',
      ...textSearchParams,
    };
  if (sort === 'lightest')
    return {
      'weight.value': 'ASC',
    };

  if (sort === 'heaviest' && textSearch)
    return {
      'weight.value': 'DESC',
      ...textSearchParams,
    };
  if (sort === 'heaviest')
    return {
      ['weight.value']: 'DESC',
    };
  if (sort === 'relevance' && textSearch) {
    return textSearchParams;
  }
  if (sort === 'relevance') {
    return { createdAt: 'DESC' };
  }
};
