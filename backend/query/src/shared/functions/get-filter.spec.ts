import { getFilter } from './get-filter';

describe('getFilter', () => {
  it('should return an empty object by default', () => {
    expect(getFilter()).toEqual({});
  });
  it('should return slug with slug only', () => {
    expect(getFilter(null, null, 'slug')).toEqual({
      slug: 'slug',
    });
  });
  it('should return textSearch with query only', () => {
    expect(getFilter('query', null, null)).toEqual({
      $text: { $search: 'query' },
    });
  });
  it('should return tags and textSearch with tags as query with tags only', () => {
    expect(getFilter(null, ['tag1', 'tag2'], null)).toEqual({
      $and: [
        { 'tags.name': { $all: ['tag1', 'tag2'] } },
        { $text: { $search: 'tag1 tag2' } },
      ],
    });
  });
  it('should return tags and textSearch with tags and query', () => {
    expect(getFilter(null, null, 'slug')).toEqual({
      slug: 'slug',
    });
  });
});
