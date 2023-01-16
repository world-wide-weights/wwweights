import { InsertItemTag } from '../interfaces/insert-item.dto';

export class TagIncrementedEvent {
  constructor(public readonly tag: InsertItemTag) {}
}
