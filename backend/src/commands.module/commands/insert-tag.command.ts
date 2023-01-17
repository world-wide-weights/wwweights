import { InsertItemTag } from '../interfaces/insert-item.dto';

export class InsertTagCommand {
  constructor(public readonly tag: InsertItemTag) {}
}
