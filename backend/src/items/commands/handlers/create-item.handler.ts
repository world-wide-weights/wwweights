import { UnprocessableEntityException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from '../../models/item.model';
import { CreateItemCommand } from '../impl/create-item.command';

@CommandHandler(CreateItemCommand)
export class CreateItemHandler implements ICommandHandler<CreateItemCommand> {
  constructor(
    @InjectRepository(Item)
    private repository: Repository<Item>,
  ) {}

  async execute(command: CreateItemCommand) {
    try {
      const result = await this.repository.save(
        new Item(command.createItemDto),
      );
      return (
        result || new UnprocessableEntityException('Item could not be created')
      );
    } catch (error) {
      throw new UnprocessableEntityException('Item could not be created');
    }
  }
}
