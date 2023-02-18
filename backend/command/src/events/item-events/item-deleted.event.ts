import { ItemDeletedEventDTO } from '../../eventstore/dtos/deleted-item-event.dto';

/**
 * @description Event for deleting an item
 */
export class ItemDeletedEvent {
  constructor(public readonly itemDeletedEventDto: ItemDeletedEventDTO) {}
}
