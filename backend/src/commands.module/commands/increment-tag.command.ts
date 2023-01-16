import { InsertItemTag } from '../interfaces/insert-item.dto';

export class IncrementTagCommand {
  constructor(public readonly tag: InsertItemTag) {}
}
