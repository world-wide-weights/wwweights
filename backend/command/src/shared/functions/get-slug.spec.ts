import { getSlug } from './get-slug';

describe('getSlug', () => {
  it('should turn lowercase', () => {
    // ACT & ASSERT
    expect(getSlug('HelloWorld')).toBe('helloworld');
  });
  it('should replace spaces', () => {
    // ACT & ASSERT
    expect(getSlug('Hello World')).toBe('hello-world');
  });
  it('should not replace spaces with option', () => {
    // ACT & ASSERT
    expect(getSlug('Hello World', ' ')).toBe('hello world');
  });
  it('should trim the ends', () => {
    // ACT & ASSERT
    expect(getSlug(' hello ')).toBe('hello');
  });
});
