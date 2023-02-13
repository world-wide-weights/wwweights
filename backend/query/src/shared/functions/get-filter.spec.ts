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
  it('should return slug with everything', () => {
    expect(getFilter('query', ['tag1', 'tag2'], 'slug', true, 1)).toEqual({
      slug: 'slug',
    });
  });
  it('should return textSearch with query only', () => {
    expect(getFilter('query')).toEqual({
      $and: [{ $text: { $search: 'query' } }],
    });
  });
  it('should return tags and textSearch with tags as query with tags only', () => {
    expect(getFilter(null, ['tag1', 'tag2'])).toEqual({
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
  it('should return image with hasimage true', () => {
    expect(getFilter(null, null, null, true)).toEqual({
      $and: [{ image: { $exists: true } }],
    });
  });
  it('should return image with hasimage false', () => {
    expect(getFilter(null, null, null, false)).toEqual({
      $and: [{ image: { $exists: false } }],
    });
  });
  it('should return user with userid given', () => {
    expect(getFilter(null, null, null, undefined, 1)).toEqual({
      $and: [{ userId: 1 }],
    });
  });
  it('should return everything if all besides slug is given', () => {
    expect(getFilter('query', ['tag1', 'tag2'], null, true, 1)).toEqual({
      $and: [
        { 'tags.name': { $all: ['tag1', 'tag2'] } },
        { $text: { $search: 'query' } },
        { image: { $exists: true } },
        { userId: 1 },
      ],
    });
  });
});
