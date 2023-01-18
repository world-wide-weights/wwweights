import { InjectModel } from '@m8a/nestjs-typegoose';
import { Logger, UnprocessableEntityException } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ReturnModelType } from '@typegoose/typegoose';
import { Tag } from '../../models/tag.model';
import { TagInsertedEvent } from './tag-inserted.event';

@EventsHandler(TagInsertedEvent)
export class TagInsertedHandler implements IEventHandler<TagInsertedEvent> {
  private readonly logger = new Logger(TagInsertedHandler.name);
  constructor(
    @InjectModel(Tag)
    private readonly tagModel: ReturnModelType<typeof Tag>,
  ) {}
  async handle({ tag }: TagInsertedEvent) {
    try {
      const insertedTag = new this.tagModel(tag);
      await insertedTag.save();

      this.logger.log(`Item inserted:  ${insertedTag.slug}`);
      // TODO: Also save alterations itemsByTag
    } catch (error) {
      // TODO: Do we handle Errors here, coz we send nothing to a user back!? SOLUTION: NEW SAGA
      this.logger.error(error);
      throw new UnprocessableEntityException('Tag could not be inserted');
    }
  }
}
