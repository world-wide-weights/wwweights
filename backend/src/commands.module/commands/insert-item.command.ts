import { InsertItemDto } from '../interfaces/insert-item.dto';

export class InsertItemCommand {
  constructor(public readonly insertItemDto: InsertItemDto) {}
}
