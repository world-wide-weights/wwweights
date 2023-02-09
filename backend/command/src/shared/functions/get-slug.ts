import slugify from 'slugify';

/**
 *
 * @param str is the String to be converted to slug
 * @param replacement is the replacer for spaces and defaults to '-'
 * @returns the slugified string
 */
export const getSlug = (str: string, replacement = '-') => {
  return slugify(str, {
    replacement,
    strict: true,
    lower: true,
    trim: true,
  });
};
