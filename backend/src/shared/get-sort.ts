export const getSort = (sort: string) => {
  if (sort === 'lightest')
    return {
      ['boosted']: 'DESC',
      ['score']: { $meta: 'textScore' },
      ['weight.value']: 'ASC',
    };
  if (sort === 'heaviest')
    return {
      ['boosted']: 'DESC',
      ['score']: { $meta: 'textScore' },
      ['weight.value']: 'DESC',
    };
  return { ['boosted']: 'DESC', ['score']: { $meta: 'textScore' } };
};
