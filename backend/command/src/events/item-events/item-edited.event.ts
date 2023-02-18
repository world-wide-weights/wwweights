import { ItemEditedEventDTO } from '../../eventstore/dtos/edited-item-event.dto';

export class ItemEditedEvent {
  constructor(public readonly itemEditedEventDto: ItemEditedEventDTO) {}
}
