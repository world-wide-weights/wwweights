import { UnprocessableEntityException } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { Item } from '../../models/item.model';
import { CreateItemCommand } from '../impl/create-item.command';

@CommandHandler(CreateItemCommand)
export class CreateItemHandler implements ICommandHandler<CreateItemCommand> {
  constructor(
    @InjectRepository(Item)
    private repository: Repository<Item>,
    private readonly publisher: EventPublisher,
  ) {}

  // No returns, just Exceptions, rest is handled by eventHandler in CQRS
  async execute(command: CreateItemCommand) {
    try {
      // PlainToInstance to trigger the slug generation
      const newItem = plainToInstance(Item, command.createItemDto);
      const createdItem = await this.repository.save(newItem);
      this.publisher.mergeObjectContext(createdItem);
    } catch (error) {
      // TODO: Do we handle this also by sending a "createItemFailed" event?
      console.error(error);
      throw new UnprocessableEntityException('Item could not be created');
    }
  }
}
