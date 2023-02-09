import { InsertItemDto } from '../interfaces/insert-item.dto';
import { JWTPayload } from '../interfaces/jwt-payload.dto';

export class InsertItemCommand {
  constructor(
    public readonly insertItemDto: InsertItemDto,
    public readonly user: JWTPayload,
  ) {}
}
