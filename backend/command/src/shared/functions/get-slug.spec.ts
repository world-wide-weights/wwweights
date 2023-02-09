import { getSlug } from './get-slug';

describe('getSlug', () => {
  it('should turn lowercase', () => {
    expect(getSlug('HelloWorld')).toBe('helloworld');
  });
  it('should replace spaces', () => {
    expect(getSlug('Hello World')).toBe('hello-world');
  });
  it('should not replace spaces with option', () => {
    expect(getSlug('Hello World', ' ')).toBe('hello world');
  });
  it('should trim the ends', () => {
    expect(getSlug(' hello ')).toBe('hello');
  });
});
