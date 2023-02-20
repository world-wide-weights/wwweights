import { InsertItemDto } from '../../controllers/dtos/insert-item.dto';

/**
 * @description Command for initiating item insertion
 */
export class InsertItemCommand {
  constructor(
    public readonly insertItemDto: InsertItemDto,
    public readonly userId: number,
  ) {}
}
