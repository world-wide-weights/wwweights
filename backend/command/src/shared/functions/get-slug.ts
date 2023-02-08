import slugify from 'slugify';

export const getSlug = (str: string, space = '-') => {
  return slugify(str, {
    replacement: space,
    strict: true,
    lower: true,
    trim: true,
  });
};
