/**
 * @description Stringifies an object. Especially handy for objects with circular dependency
 */
export const getStringified = (obj: any) => {
  return JSON.stringify(obj, null, 2);
};
