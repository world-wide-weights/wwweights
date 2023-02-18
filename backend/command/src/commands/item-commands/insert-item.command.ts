import { InsertItemDto } from '../../controllers/interfaces/insert-item.dto';

export class InsertItemCommand {
  constructor(
    public readonly insertItemDto: InsertItemDto,
    public readonly userId: number,
  ) {}
}
