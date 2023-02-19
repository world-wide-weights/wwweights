import { ItemListHandler } from './item-list.handler';
import { ItemStatisticsHandler } from './item-statistics.handler';
import { ItemRelatedHandler } from './related-items.handler';

/**
 * @description Array of all query handlers
 */
export const QueryHandlers = [
  ItemListHandler,
  ItemRelatedHandler,
  ItemStatisticsHandler,
];
