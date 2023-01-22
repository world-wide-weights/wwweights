import slugify from 'slugify';

export const getSlug = (str: string, space: string) => {
  return slugify(str, {
    replacement: space,
    strict: true,
    lower: true,
    trim: true,
  });
};
