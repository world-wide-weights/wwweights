import { InjectModel } from "@m8a/nestjs-typegoose";
import { Logger } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { ReturnModelType } from '@typegoose/typegoose';
import { Tag } from "../../models/tag.model";
import { TagIncrementedEvent } from "./tag-incremented.event";


@EventsHandler(TagIncrementedEvent)
export class TagIncrementedHandler implements IEventHandler<TagIncrementedEvent> {
  private readonly logger = new Logger(TagIncrementedHandler.name);
  constructor(
    @InjectModel(Tag)
    private readonly itemModel: ReturnModelType<typeof Tag>,
  ) {}
  async handle(event: TagIncrementedEvent) {}