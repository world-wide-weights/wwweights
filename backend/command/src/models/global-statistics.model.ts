import { prop } from '@typegoose/typegoose';

/**
 * @description Entity/Model for global statistics in read Db
 */
export class GlobalStatistics {
  @prop()
  totalItems: number;

  @prop()
  totalSuggestions: number;

  // No constructor because it is never used
}
