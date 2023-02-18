import { ItemDeletedEventDTO } from '../../eventstore/dtos/deleted-item-event.dto';

export class ItemDeletedEvent {
  constructor(public readonly itemDeletedEventDto: ItemDeletedEventDTO) {}
}
