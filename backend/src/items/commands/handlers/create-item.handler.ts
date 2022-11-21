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
    try {
      // TODO: Class or Object?
      const result = this.publisher.mergeObjectContext(
        await this.repository.save(new Item(command.createItemDto)),
      );
      return (
        result || new UnprocessableEntityException('Item could not be created')
      );
    } catch (error) {
      throw new UnprocessableEntityException('Item could not be created');
    }
  }
}
