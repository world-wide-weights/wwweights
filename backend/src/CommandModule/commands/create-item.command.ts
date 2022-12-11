import { CreateItemDto } from '../interfaces/create-item.dto';

export class CreateItemCommand {
  constructor(public readonly createItemDto: CreateItemDto) {}
}
