import { prop } from '@typegoose/typegoose';
import { SUGGESTION_STATUS } from '../shared/enums/suggestion-status.enum';

/**
 * @description Entity/Model for delete suggestion in read db
 */
export class DeleteSuggestion {
  @prop({ required: true })
  userId: number;

  @prop({ required: true })
  itemSlug: string;

  @prop()
  reason?: string;

  @prop({ required: true, default: SUGGESTION_STATUS.PENDING })
  status: SUGGESTION_STATUS;

  @prop({ required: true, default: 0 })
  approvalCount: number;

  @prop({ required: true })
  uuid: string;

  constructor(partial: Partial<DeleteSuggestion>) {
    Object.assign(this, partial);
  }
}
