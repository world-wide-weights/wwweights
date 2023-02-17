import { IsUrl } from './is-url';

describe('isUrl', () => {
  it('Should return true for url', () => {
    // ACT && ASSERT
    expect(IsUrl('https://google.com')).toBe(true);
  });

  it('Should return false for non url', () => {
    // ACT && ASSERT
    expect(IsUrl('Meal Deal at TESCO')).toBe(false);
  });

  it('Should return false for undefined', () => {
    // ACT && ASSERT
    expect(IsUrl(undefined)).toBe(false);
  });
});
