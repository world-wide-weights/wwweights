import { prop } from '@typegoose/typegoose';

export class GlobalStatistics {
  @prop()
  totalItems: number;

  @prop()
  totalSuggestions: number;

  constructor(Partial: Partial<GlobalStatistics>) {
    Object.assign(this, Partial);
  }
}
