import { UnprocessableEntityException } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
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

  async execute(command: CreateItemCommand) {
    // No returns, just Exceptions, rest is handled by eventHandler in CQRS
    try {
      // TODO: Class or Object?
      const newItem = new Item(command.createItemDto);
      const createdItem = await this.repository.save(newItem);
      this.publisher.mergeObjectContext(createdItem);
    } catch (error) {
      console.log(error);
      throw new UnprocessableEntityException('Item could not be created');
    }
  }
}
