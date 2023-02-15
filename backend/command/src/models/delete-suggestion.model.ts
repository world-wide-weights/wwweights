import { AggregateRoot } from '@nestjs/cqrs';
import { prop } from '@typegoose/typegoose';
import { SUGGESTION_STATUS } from '../shared/enums/suggestion-status.enum';

export class DeleteSuggestion extends AggregateRoot {
  @prop({ required: true })
  userId: number;

  @prop({ required: true })
  itemSlug: string;

  @prop()
  reason?: string;

  @prop({ required: true, default: SUGGESTION_STATUS.PENDING })
  status: SUGGESTION_STATUS;

  @prop({ required: true })
  uuid: string;

  constructor(partial: Partial<DeleteSuggestion>) {
    super();
    Object.assign(this, partial);
  }
}
