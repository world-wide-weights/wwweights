import { AggregateRoot } from '@nestjs/cqrs';
import { prop } from '@typegoose/typegoose';
import { Expose } from 'class-transformer';

export class DeleteSuggestion extends AggregateRoot {
  @Expose()
  @prop({ required: true })
  userId: number;

  @Expose()
  @prop({ required: true })
  itemSlug: string;

  @Expose()
  @prop()
  reason?: string;

  @Expose()
  @prop({ required: true })
  uuid: string;

  constructor(partial: Partial<DeleteSuggestion>) {
    super();
    Object.assign(this, partial);
  }
}
