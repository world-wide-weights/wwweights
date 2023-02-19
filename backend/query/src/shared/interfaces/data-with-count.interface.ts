/**
 * @description Interface for generic data with a total count
 */
export interface DataWithCount<T> {
  total: [{ count: number }];

  data: T[];
}
