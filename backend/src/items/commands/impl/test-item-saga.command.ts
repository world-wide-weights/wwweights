import { Item } from '../../models/item.model';

export class TestItemSagaCommand {
  constructor(public readonly item: Item) {}
}
