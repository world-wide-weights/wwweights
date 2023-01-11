// There has not been any obvious way how to deal with this kind of syntax to reduce lines of code
export const getSort = (sort: string, textSearch: boolean) => {
  if (sort === 'lightest' && textSearch)
    return {
      ['boosted']: 'DESC',
      ['score']: { $meta: 'textScore' },
      ['weight.value']: 'ASC',
    };
  if (sort === 'lightest')
    return {
      ['weight.value']: 'ASC',
    };
  if (sort === 'heaviest' && textSearch)
    return {
      ['boosted']: 'DESC',
      ['score']: { $meta: 'textScore' },
      ['weight.value']: 'DESC',
    };
  if (sort === 'heaviest')
    return {
      ['weight.value']: 'DESC',
    };
  return { ['boosted']: 'DESC', ['score']: { $meta: 'textScore' } };
};
